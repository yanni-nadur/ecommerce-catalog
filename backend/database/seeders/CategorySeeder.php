<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

// Ensure the Category model exists in the App\Models namespace

class CategorySeeder extends Seeder
{
    public function run()
    {
        Category::insert([
            ['name' => 'Eletrônicos', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Roupas', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Eletrodomésticos', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
