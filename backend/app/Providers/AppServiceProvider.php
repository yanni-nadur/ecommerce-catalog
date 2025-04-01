<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\ProductRepository;
use App\Services\ProductService;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ProductRepository::class, function ($app) {
            return new ProductRepository();
        });

        $this->app->bind(ProductService::class, function ($app) {
            return new ProductService($app->make(ProductRepository::class));
        });
    }
}
