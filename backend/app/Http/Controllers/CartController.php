<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $items = Cart::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'message' => 'Success',
            'data' => $items,
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $cart = Cart::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Item sukses ditambahkan ke cart',
            'data' => $cart,
        ], 201);
    }

    public function show(Request $request, Cart $cart)
    {
        // $this->ensureOwner($request, $cart);

        return response()->json([
            'message' => 'Success',
            'data' => $cart,
        ], 200);
    }

    public function update(Request $request, Cart $cart)
    {
        // $this->ensureOwner($request, $cart);

        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        $cart->update($validated);

        return response()->json([
            'message' => 'Item sukses diperbarui',
            'data' => $cart,
        ], 200);
    }

    public function destroy(Request $request, Cart $cart)
    {
        // $this->ensureOwner($request, $cart);

        $cart->delete();

        return response()->json([
            'message' => 'Item sukses terhapus',
        ], 200);
    }

    // private function ensureOwner(Request $request, Cart $cart): void
    // {
    //     if ($cart->user_id !== $request->user()->id) {
    //         abort(403, 'Tidak boleh mengakses cart milik pengguna lain');
    //     }
    // }
}
