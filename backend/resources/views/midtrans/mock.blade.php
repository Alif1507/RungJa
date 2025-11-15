<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulated Midtrans Payment</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f9fafb; color: #111827; }
        .container { max-width: 480px; margin: 5rem auto; padding: 2rem; background: #fff; border-radius: 1rem; box-shadow: 0 20px 45px rgba(0,0,0,0.08); text-align: center; }
        h1 { margin-bottom: 1rem; font-size: 1.5rem; }
        p { margin-bottom: 1rem; }
        .order { font-weight: bold; color: #2563eb; }
        a.button { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; border-radius: 999px; background: #2563eb; color: white; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Payment Simulation</h1>
        <p>This environment is running in Midtrans mock mode, so no real transaction was created.</p>
        @if($order)
            <p>Order <span class="order">{{ $order }}</span> is marked as <strong>paid</strong> for testing.</p>
        @endif
        <p>You can close this tab and return to the store.</p>
        <a class="button" href="{{ config('app.url') }}">Back to Store</a>
    </div>
</body>
</html>
