<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");  

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
} 

if ($requestUri === '/register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new \App\Controllers\RegisterController();
    $controller->register();
} else { 
    http_response_code(404);
    echo json_encode(["message" => "Route not found", "path" => $requestUri]);
}

 