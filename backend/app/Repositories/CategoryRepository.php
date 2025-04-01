<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    public function getAll(): Collection
    {
        return Category::all();
    }

    public function findById(int $id): ?Category
    {
        return Category::where('id', $id)->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(int $id, array $data): ?Category
    {
        $category = $this->findById($id);
        if (!$category) {
            return null;
        }
        $category->update($data);
        return $category;
    }

    public function delete(int $id): bool
    {
        $category = $this->findById($id);
        if (!$category) {
            return false;
        }
        return (bool) $category->delete();
    }
}
