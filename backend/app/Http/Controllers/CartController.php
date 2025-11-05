<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Cart::all();

        return response()->json([
            "message" => "Success",
            "data" => $data
        ],200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validateData = $request->validate([
            "item_name" => "required|string",
            "quantity" => "required|integer",
            "price" => "required|integer"
        ]);

        $cart = Cart::create($validateData);

        return response()->json([
            "message" => "item sukses ke add ke cart",
            "data" => $cart
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cart $cart)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cart = Cart::findOrFail($id);

        $validateData = $request->validate([
            "item_name" => "required|string",
            "quantity" => "required|integer",
            "price" => "required|integer"
        ]);

        $cart->update($validateData);

        return response()->json([
            "message" => "item sukses terupdate",
            "data" => $cart
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();

        return response()->json([
            "message" => "item sukses terhapus",

        ], 200);
    }
}
