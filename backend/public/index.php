<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Check if the path matches what React is sending
if ($requestUri === '/register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new \App\Controllers\RegisterController();
    $controller->register();
} else {
    // If you see this in your Network tab response, your routing is wrong
    http_response_code(404);
    echo json_encode(["message" => "Route not found", "path" => $requestUri]);
}