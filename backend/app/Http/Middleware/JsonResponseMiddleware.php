<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JsonResponseMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response instanceof Response && !$response->isSuccessful()) {
            return response()->json([
                'success' => false,
                'message' => $response->getContent()
            ], $response->getStatusCode());
        }

        return $response;
    }
}
