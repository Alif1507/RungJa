<?php

use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\ValidateSignature;
use Illuminate\Auth\Middleware\AuthenticateWithBasicAuth;
use Illuminate\Auth\Middleware\Authorize;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Http\Middleware\SetCacheHeaders;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // kalau mau nambah web/api middleware global:
        // $middleware->web(append: [ ... ]);
        // $middleware->api(append: [ ... ]);

        $middleware->alias([
            // default bawaan laravel
            'auth'             => Authenticate::class,
            'auth.basic'       => AuthenticateWithBasicAuth::class,
            'auth.session'     => AuthenticateSession::class,
            'cache.headers'    => SetCacheHeaders::class,
            'can'              => Authorize::class,
            'guest'            => RedirectIfAuthenticated::class,
            'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
            'precognitive'     => HandlePrecognitiveRequests::class,
            'signed'           => ValidateSignature::class,
            'throttle'         => ThrottleRequests::class,
            'verified'         => EnsureEmailIsVerified::class,
            'is_admin'         => IsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
