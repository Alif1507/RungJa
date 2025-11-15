<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function __construct(
        protected MidtransService $midtrans
    ) {}

    public function checkout(Request $request)
    {
        $user = $request->user();

        // ambil cart aktif user
        $cart = Cart::with('items.menu')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 400);
        }

        // pastikan stok cukup
        foreach ($cart->items as $item) {
            if ($item->menu->stock < $item->quantity) {
                return response()->json([
                    'message' => "Stock for {$item->menu->name} is not available.",
                ], 422);
            }
        }

        // hitung total
        $total = $cart->items->sum(fn ($item) => $item->price * $item->quantity);

        // bikin kode order unik
        $orderCode = 'ORD-' . Str::upper(Str::random(10));

        try {
            $order = DB::transaction(function () use ($cart, $user, $orderCode, $total) {
                $order = Order::create([
                    'user_id'      => $user->id,
                    'order_code'   => $orderCode,
                    'total_amount' => $total,
                    'status'       => 'pending',
                ]);

                foreach ($cart->items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_id'  => $item->menu_id,
                        'quantity' => $item->quantity,
                        'price'    => $item->price,
                    ]);

                    $item->menu->decrement('stock', $item->quantity);
                }

                // tandai cart sudah di-checkout dan kosongkan isinya
                $cart->update(['status' => 'checked_out']);
                $cart->items()->delete();

                return $order->fresh('items.menu');
            });
        } catch (\Throwable $th) {
            report($th);

            return response()->json([
                'message' => 'Failed to create order.',
            ], 500);
        }

        // siapkan item_details untuk Midtrans
        $midtransItems = $cart->items->map(function ($item) {
            return [
                'id'       => $item->menu_id,
                'price'    => (int) $item->price,
                'quantity' => $item->quantity,
                'name'     => $item->menu->name,
            ];
        })->toArray();

        $params = [
            'transaction_details' => [
                'order_id'     => $orderCode,
                'gross_amount' => (int) $total,
            ],
            'item_details' => $midtransItems,
            'customer_details' => [
                'first_name' => $user->name,
                'email'      => $user->email,
            ],
        ];

        try {
            $snap = $this->midtrans->createTransaction($params);

            // simpan sedikit info Midtrans ke order
            $order->update([
                'midtrans_payload'        => $snap,
                'midtrans_transaction_id' => $snap->token ?? null,
            ]);
        } catch (\Throwable $th) {
            report($th);
            $order->update(['status' => 'failed']);

            return response()->json([
                'message' => 'Failed to initiate payment gateway.',
            ], 502);
        }

        return response()->json([
            'message'     => 'Midtrans transaction created',
            'snapToken'   => $snap->token,
            'redirectUrl' => $snap->redirect_url,
            'isMock'      => (bool) ($snap->is_mock ?? false),
            'order'       => $order->fresh('items.menu'),
        ]);
    }

    /**
     * Midtrans notification callback (webhook)
     */
    public function handleNotification(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');

        $signatureKey = $request->input('signature_key');
        $orderId      = $request->input('order_id');      // = order_code kita
        $statusCode   = $request->input('status_code');
        $grossAmount  = $request->input('gross_amount');

        // verifikasi signature
        $mySignature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        if ($signatureKey !== $mySignature) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $transactionStatus = $request->input('transaction_status');
        $paymentType       = $request->input('payment_type');
        $fraudStatus       = $request->input('fraud_status');

        // cari order berdasarkan order_code
        $order = Order::where('order_code', $orderId)->first();

        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // mapping status midtrans -> status lokal
        $newStatus = $order->status;

        if ($transactionStatus === 'capture') {
            if ($fraudStatus === 'accept') {
                $newStatus = 'paid';
            } else {
                $newStatus = 'failed';
            }
        } elseif ($transactionStatus === 'settlement') {
            $newStatus = 'paid';
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            $newStatus = 'cancelled';
        } elseif ($transactionStatus === 'pending') {
            $newStatus = 'pending';
        }

        $order->update([
            'status'          => $newStatus,
            'payment_type'    => $paymentType,
            'payment_status'  => $transactionStatus,
            'midtrans_payload'=> $request->all(),
        ]);

        return response()->json(['message' => 'OK']);
    }
}
