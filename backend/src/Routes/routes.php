<?php
use App\Config\Database;
use App\Controllers\AuthController;
use App\Repositories\UserRepository;
use App\Services\AuthService;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];


$db = new Database();
$userRepo = new UserRepository($db->getConnection());
$authService = new AuthService($userRepo);
$authController = new AuthController($authService);


$routes = [
    'POST' => [
        '/login'    => fn() => $authController->login(),
        '/register' => fn() => $authController->register(),
    ],
    'GET' => [
        '/user' => fn() => $authController->getUser(),
    ],
];

if (isset($routes[$method][$uri])) {
    $routes[$method][$uri]();
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Route not found']);
}