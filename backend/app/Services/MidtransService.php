<?php

namespace App\Services;

use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    protected bool $mockMode;

    public function __construct()
    {
        Config::$serverKey    = config('services.midtrans.server_key');
        Config::$isProduction = (bool) config('services.midtrans.is_production');
        Config::$isSanitized  = true;
        Config::$is3ds        = true;

        $this->mockMode = empty(Config::$serverKey) || config('services.midtrans.stub', true);
    }

    public function createTransaction(array $params)
    {
        if ($this->mockMode) {
            return $this->fakeResponse($params);
        }

        try {
            return Snap::createTransaction($params);
        } catch (\Throwable $th) {
            report($th);

            if (config('services.midtrans.fallback_on_failure', true)) {
                return $this->fakeResponse($params);
            }

            throw $th;
        }
    }

    protected function fakeResponse(array $params): object
    {
        $orderId = $params['transaction_details']['order_id'] ?? ('ORD-' . Str::upper(Str::random(6)));

        $redirect = route('midtrans.mock', ['order' => $orderId], absolute: true);

        return (object) [
            'token'        => 'SIM-' . Str::upper(Str::random(16)),
            'redirect_url' => $redirect,
            'is_mock'      => true,
        ];
    }
}
