<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];


if ($requestUri === '/register' && $method === 'POST') {
    (new \App\Controllers\RegisterController())->register();
} else if ($requestUri === '/scripts' && $method === 'GET') {
    (new \App\Controllers\ScriptController())->index();
} else {
    http_response_code(404);
    echo json_encode([
        "status" => "error",
        "message" => "Route not found",
        "path" => $requestUri
    ]);
}