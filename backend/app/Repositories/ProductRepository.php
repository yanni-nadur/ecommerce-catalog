<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Product::with('category')->paginate($perPage);
    }

    public function findById(int $id)
    {
        return Product::find($id);
    }

    public function findByCategory(int $categoryId, int $perPage = 10): LengthAwarePaginator
    {
        return Product::with('category')
            ->where('category_id', $categoryId)
            ->paginate($perPage);
    }

    public function search(string $query, int $perPage = 10): LengthAwarePaginator
    {
        return Product::with('category')
            ->where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->paginate($perPage);
    }
    
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product;
    }

    public function delete(Product $product): bool
    {
        return $product->delete();
    }
}
