<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'stock',
        'image_url',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
    ];
}
