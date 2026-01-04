<?php

namespace App\Providers;

use App\Models\Mashup;
use App\Policies\MashupPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        if (env('APP_ENV') !== 'local' || str_contains(env('APP_URL'), 'ngrok') || str_contains(env('APP_URL'), 'trycloudflare') || str_contains(env('APP_URL'), 'devtunnels.ms')) {
            URL::forceScheme('https');
        }
    }

    /**
     * Register the application's policies.
     */
    protected function registerPolicies(): void
    {
        \Illuminate\Support\Facades\Gate::policy(Mashup::class, MashupPolicy::class);
    }
}
