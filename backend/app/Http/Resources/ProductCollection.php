<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProductCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray($request): array
    {
        return [
            'products' => ProductResource::collection($this->collection),
            'meta' => [
                'total'       => $this->total(),
                'count'       => $this->count(),
                'per_page'    => $this->perPage(),
                'current_page'=> $this->currentPage(),
                'total_pages' => $this->lastPage(),
            ],
        ];
    }
}
