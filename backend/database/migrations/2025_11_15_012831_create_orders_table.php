<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // orders
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_code')->unique(); // misal: ORD-XXXXXX
            $table->integer('total_amount');        // total dalam rupiah (integer)
            $table->string('status')->default('pending'); 
            // pending, paid, failed, cancelled, expired

            $table->string('payment_type')->nullable();
            $table->string('payment_status')->nullable();
            $table->string('midtrans_transaction_id')->nullable();
            $table->json('midtrans_payload')->nullable();

            $table->timestamps();
        });

        // order_items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_id')->constrained()->onDelete('cascade'); // relasi ke menus
            $table->integer('quantity');
            $table->integer('price'); // harga per item saat checkout (rupiah)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
