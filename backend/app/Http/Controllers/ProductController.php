<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Models\Product;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * GET /api/products
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = (int) $request->get('per_page', 10);

            if ($request->has('category')) {
                $categoryId = (int) $request->query('category');
                $products = $this->productService->getProductsByCategory($categoryId, $perPage);
            } elseif ($request->has('search')) {
                $query = $request->query('search');
                $products = $this->productService->searchProducts($query, $perPage);
            } else {
                $products = $this->productService->getAllProducts($perPage);
            }

            return response()->json([
                'success' => true,
                'data' => new ProductCollection($products)
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao listar produtos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/products/{id}
     */
    public function show(int $id): JsonResponse
    {
        try {
            $product = $this->productService->getProductById($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produto não encontrado.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product)
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/products
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'image_url' => 'nullable|url',
            ]);

            $product = $this->productService->createProduct($validated);

            return response()->json([
                'success' => true,
                'message' => 'Produto criado com sucesso!',
                'data' => new ProductResource($product)
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao criar produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/products/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'sometimes|string',
                'description' => 'sometimes|string',
                'price' => 'sometimes|numeric',
                'image_url' => 'sometimes|url',
                'category_id' => 'sometimes|exists:categories,id',
            ]);

            $updatedProduct = $this->productService->updateProduct($id, $request->all());

            if (!$updatedProduct) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produto não encontrado'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produto atualizado com sucesso!',
                'data' => new ProductResource($updatedProduct)
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar o produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/products/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $product = $this->productService->getProductById($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produto não encontrado.'
                ], 404);
            }

            $this->productService->deleteProduct($product);

            return response()->json([
                'success' => true,
                'message' => 'Produto deletado com sucesso.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao deletar produto',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
