<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * GET /api/categories
     */
    public function index(): JsonResponse
    {
        try {
            $categories = $this->categoryService->getAllCategories();
            return response()->json([
                'success' => true,
                'data' => (new CategoryCollection($categories))->toArray(request())
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar categorias',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/categories/{id}
     */
    public function show(int $id): JsonResponse
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoria não encontrada'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => (new CategoryResource($category))->toArray(request())
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/categories
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:categories',
            ]);
    
            $category = $this->categoryService->createCategory($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Categoria criada com sucesso!',
                'data' => (new CategoryResource($category))->toArray(request())
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/categories/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:categories,name,' . $id,
            ]);
    
            $updatedCategory = $this->categoryService->updateCategory($id, $request->all());
    
            if (!$updatedCategory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoria não encontrada'
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'message' => 'Categoria atualizada com sucesso!',
                'data' => (new CategoryResource($updatedCategory))->toArray(request())
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/categories/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $deleted = $this->categoryService->deleteCategory($id);
    
            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoria não encontrada'
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'message' => 'Categoria excluída com sucesso'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao excluir categoria',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
