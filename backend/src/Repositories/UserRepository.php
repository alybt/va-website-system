<?php
namespace App\Repositories;

use App\Models\User;
use PDO;

class UserRepository {
    private $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function findByusername($username) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(['username' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create(User $user): bool {
        $sql = "INSERT INTO users (username, password, role, status) 
                VALUES (:username, :password, :role, :status)";
        
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            'username' => $user->username,
            'password' => $user->password, 
            'role'     => $user->role ?? 'writer',
            'status'   => 'active'
        ]);
    }

    public function exists(string $username): bool {
        $stmt = $this->db->prepare("SELECT 1 FROM users WHERE username = ?");
        $stmt->execute([$username]);
        return (bool)$stmt->fetchColumn();
    }

}