<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // list order milik user yang login
    public function index(Request $request)
    {
        $perPage = max(1, min((int) $request->query('per_page', 10), 50));

        $orders = Order::with('items.menu')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'message' => 'success',
            'data'    => $orders,
        ]);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $order->load('items.menu', 'user');

        return response()->json([
            'message' => 'success',
            'data'    => $order,
        ]);
    }

    public function adminIndex(Request $request)
    {
        $perPage = max(1, min((int) $request->query('per_page', 15), 100));

        $orders = Order::with(['items.menu', 'user'])
            ->when($request->query('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'message' => 'success',
            'data'    => $orders,
        ]);
    }

    public function stats()
    {
        $totals = [
            'total_orders'   => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'paid_orders'    => Order::where('status', 'paid')->count(),
            'revenue'        => Order::where('status', 'paid')->sum('total_amount'),
        ];

        $latestOrders = Order::with('user')
            ->latest()
            ->take(5)
            ->get();

        $topMenus = OrderItem::select('menu_id', DB::raw('SUM(quantity) as total_quantity'))
            ->with('menu')
            ->groupBy('menu_id')
            ->orderByDesc('total_quantity')
            ->take(5)
            ->get();

        return response()->json([
            'message' => 'success',
            'data'    => [
                'totals'       => $totals,
                'latestOrders' => $latestOrders,
                'topMenus'     => $topMenus,
            ],
        ]);
    }
}
