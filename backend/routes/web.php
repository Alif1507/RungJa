<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/midtrans/mock', function (\Illuminate\Http\Request $request) {
    return view('midtrans.mock', [
        'order' => $request->query('order'),
    ]);
})->name('midtrans.mock');
