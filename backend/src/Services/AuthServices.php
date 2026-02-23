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

    public function register(array $data) {
        // 1. Check if user exists
        if ($this->userRepository->exists($data['username'])) {
            throw new \Exception("Username already taken");
        }

        // 2. Map data to the User Model
        $user = new User();
        $user->username = $data['username'];
        $user->password = password_hash($data['password'], PASSWORD_BCRYPT);
        $user->role = $data['role'] ?? 'writer';

        // 3. Save via Repository
        return $this->userRepository->create($user);
    }


}