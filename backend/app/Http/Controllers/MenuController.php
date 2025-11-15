<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Menu::query()->latest();

    if ($category = $request->query('category')) {
        $query->where('category', $category);
    }

    $menus = $query->paginate(10);

    return response()->json([
        "message" => "success",
        "data"    => $menus,
    ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "decription" => "nullable|string",
            "price" => "required|integer|min:0",
            "category"   => "required|in:makanan,minuman",
            "image_url" => "nullable|url",
            "stock" => "required|integer|min:0"

        ]);

        $menu = Menu::create($validated);

        return response()->json([
            "message" => "menu berhasil di tambahkan",
            "data" => $menu,          
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        return response()->json([
            "message" => "success",
            "data" => $menu,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
         $validated = $request->validate([
            "name" => "required|string|max:255",
            "decription" => "nullable|string",
            "category"   => "required|in:makanan,minuman",
            "price" => "required|integer|min:0",
            "image_url" => "nullable|url",
            "stock" => "required|integer|min:0"
        ]);

        $menu->update($validated);

        return response()->json([
            "message" => "menu berhasil di tambahkan",
            "data" => $menu,          
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        $menu->delete();

        return response()->json([
            "message" => "menu berhasil di hapus",
        ], 200);
    }
}
