<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Http\Request;

// app/Http/Controllers/Api/CartController.php
class CartController extends Controller
{
    protected function getActiveCart(User $user): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'active'],
            []
        );
    }

    public function show(Request $request)
    {
        $cart = $this->getActiveCart($request->user())
            ->load('items.menu');

        return $cart;
    }

    public function addItem(Request $request)
    {
        $data = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $cart = $this->getActiveCart($user);

        $menu = Menu::findOrFail($data['menu_id']);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('menu_id', $menu->id)
            ->first();

        if ($item) {
            $item->quantity += $data['quantity'];
            $item->save();
        } else {
            $item = CartItem::create([
                'cart_id'    => $cart->id,
                'menu_id' => $menu->id,
                'quantity'   => $data['quantity'],
                'price'      => $menu->price,
            ]);
        }

        return $cart->fresh('items.menu');
    }

    public function updateItem(Request $request, CartItem $item)
    {
        // ensure item belongs to current user
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $item->update($data);
        return $item->cart->fresh('items.menu');
    }

    public function removeItem(Request $request, CartItem $item)
    {
        if ($item->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $cart = $item->cart;
        $item->delete();

        return $cart->fresh('items.menu');
    }
}

