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

    $database = new \App\Config\Database();
    $db = $database->getConnection();

    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $method = $_SERVER['REQUEST_METHOD'];
    error_log("URI: $requestUri | Method: $method");

    if ($requestUri === '/login' && $method === 'POST') {
        $userRepository = new \App\Repositories\UserRepository($db);
        $authService    = new \App\Services\AuthService($userRepository);
        $controller     = new \App\Controllers\AuthController($authService);
        $controller->login();

    } else if ($requestUri === '/register' && $method === 'POST') {
        $userRepository = new \App\Repositories\UserRepository($db);
        (new \App\Controllers\RegisterController())->register();

    } else if ($requestUri === '/scripts' && $method === 'GET') {
        (new \App\Controllers\ScriptController())->index();

    } else if ($requestUri === '/scripts/meta' && $method === 'GET') {
        (new \App\Controllers\ScriptController())->meta();

    } else if ($segments[0] === 'actors') {
        $controller = new ActorController(new ActorRepository($db));
        $controller->handle($method, $segments, $body ?? null);
        exit;

    } else if ($segments[0] === 'characters') {
        $controller = new CharacterController(new CharacterRepository($db));
        $controller->handle($method, $segments, $body ?? null);
        exit;

    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Route not found"]);
    }
