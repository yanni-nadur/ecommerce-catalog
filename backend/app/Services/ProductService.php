<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAllProducts(int $perPage = 10): LengthAwarePaginator
    {
        return $this->productRepository->getAll($perPage);
    }

    public function getProductById(int $id): ?Product
    {
        return $this->productRepository->findById($id)->first();
    }

    public function getProductsByCategory(int $categoryId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->productRepository->findByCategory($categoryId, $perPage);
    }

    public function searchProducts(string $query, int $perPage = 10): LengthAwarePaginator
    {
        return $this->productRepository->search($query, $perPage);
    }

    public function createProduct(array $data): Product
    {
        return $this->productRepository->create($data);
    }

    public function updateProduct(int $id, array $data)
    {
        $product = $this->productRepository->findById($id);

        if (!$product) {
            return null;
        }

        $product->update($data);

        return $product->refresh();
    }

    public function deleteProduct(Product $product): bool
    {
        return $this->productRepository->delete($product);
    }
}
