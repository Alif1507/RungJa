<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of menus with optional filtering.
     */
    public function index(Request $request)
    {
        $query = Menu::query()->latest();

        if ($search = $request->query('q')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', '%'.$search.'%')
                    ->orWhere('description', 'like', '%'.$search.'%');
            });
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (int) $request->query('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (int) $request->query('max_price'));
        }

        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(1, min($perPage, 50));

        $menus = $query->paginate($perPage)->withQueryString();

        return response()->json([
            'message' => 'success',
            'data'    => $menus,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'category'    => 'required|in:makanan,minuman',
            'image_url'   => 'nullable|url',
            'stock'       => 'required|integer|min:0',
        ]);

        $menu = Menu::create($validated);

        return response()->json([
            'message' => 'Menu created',
            'data'    => $menu,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        return response()->json([
            'message' => 'success',
            'data'    => $menu,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Menu $menu)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'category'    => 'sometimes|required|in:makanan,minuman',
            'price'       => 'sometimes|required|integer|min:0',
            'image_url'   => 'sometimes|nullable|url',
            'stock'       => 'sometimes|required|integer|min:0',
        ]);

        $menu->update($validated);

        return response()->json([
            'message' => 'Menu updated',
            'data'    => $menu,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Menu $menu)
    {
        $this->ensureAdmin($request);

        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted',
        ]);
    }

    protected function ensureAdmin(Request $request): void
    {
        abort_if(! $request->user() || ! $request->user()->isAdmin(), 403, 'Only admins can manage menus.');
    }
}
