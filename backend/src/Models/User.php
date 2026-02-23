<?php
namespace App\Models;

class User {
    public int $user_id;
    public string $username;
    public string $password; 
    public ?string $bio;
    public string $status;
    public string $role;
    public string $last_active;
    public bool $is_deleted;
    public ?string $deleted_at;

    public function isAdmin(): bool {
        return $this->role === 'admin';
    }

    public function isUser(): bool {
        return $this->role === 'user';
    }

}
