<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // pastikan user login & role = admin
        if (! $request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Forbidden (admin only)',
            ], 403);
        }

        return $next($request);
    }
}
