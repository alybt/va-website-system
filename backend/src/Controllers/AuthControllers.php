<?php
namespace App\Controllers;

use App\Services\AuthService;

class AuthController {
    private $authService;

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function login() {
        // Get JSON body from React
        $data = json_decode(file_get_contents("php://input"), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $user = $this->authService->authenticate($email, $password);

        if ($user) {
            echo json_encode([
                "status" => "success",
                "user" => $user,
                "token" => "dummy-jwt-token" // You'll generate a real JWT later
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid email or password"]);
        }
    }
}