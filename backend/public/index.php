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

use App\Controllers\ActorController;
use App\Controllers\CharacterController;
use App\Controllers\SequentialArtController;
use App\Repositories\SequentialArtRepository;
use App\Repositories\ActorRepository;
use App\Repositories\CharacterRepository;

$database = new \App\Config\Database();
$db       = $database->getConnection(); 
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method     = $_SERVER['REQUEST_METHOD'];
$body       = json_decode(file_get_contents('php://input'), true) ?? []; 
$segments = explode('/', trim($requestUri, '/'));

error_log("URI: $requestUri | Method: $method | Segments: " . implode(', ', $segments)); 

if ($requestUri === '/login' && $method === 'POST') {
    $userRepository = new \App\Repositories\UserRepository($db);
    $authService    = new \App\Services\AuthService($userRepository);
    $controller     = new \App\Controllers\AuthController($authService);
    $controller->login();

} elseif ($requestUri === '/register' && $method === 'POST') {
    (new \App\Controllers\RegisterController())->register();

} elseif ($requestUri === '/scripts' && $method === 'GET') {
    (new \App\Controllers\ScriptController())->index();

} elseif ($requestUri === '/scripts/meta' && $method === 'GET') {
    (new \App\Controllers\ScriptController())->meta();

} elseif ($segments[0] === 'actors') {
    $controller = new ActorController(new ActorRepository($db));
    $controller->handle($method, $segments, $body);

} elseif ($segments[0] === 'sequential-art') {
    $controller = new SequentialArtController(new SequentialArtRepository($db));
    $controller->handle($method, $segments);

} elseif ($segments[0] === 'characters') {
    $controller = new CharacterController(new CharacterRepository($db));
    $controller->handle($method, $segments, $body);

} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Route not found"]);
}