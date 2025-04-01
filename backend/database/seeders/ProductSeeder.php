<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Product::insert([
            [
                'name' => 'Smartphone',
                'description' => 'Celular top',
                'price' => 2999.99,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/480/480',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Smartphone 2',
                'description' => 'Celular top 2',
                'price' => 4999.99,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/600/600',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
