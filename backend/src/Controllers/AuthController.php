<?php
namespace App\Controllers;

use App\Services\AuthService;

class AuthController {
    private $authService;

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function login() { 
        $data = json_decode(file_get_contents("php://input"), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        $user = $this->authService->authenticate($username, $password);

        if ($user) {
            echo json_encode([
                "status" => "success",
                "user" => $user,
                "token" => "dummy-jwt-token"  
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid username or password"]);
        }
    }
    
}