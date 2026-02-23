<?php
namespace App\Services;

use App\Repositories\UserRepository;

class AuthService {
    private $userRepository;

    public function __construct(UserRepository $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function authenticate($email, $password) {
        $user = $this->userRepository->findByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            // Remove password before sending user data back
            unset($user['password']);
            return $user;
        }

        return false;
    }
}