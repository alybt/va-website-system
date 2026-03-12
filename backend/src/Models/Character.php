<?php

namespace App\Models;

class Character {
    public int $character_id;
    public string $name;
    public ?string $gender;
    public ?int $age;
    public ?string $description;
    public ?string $role;
    public ?string $pic;
    public bool $is_deleted;
    public ?string $deleted_at;

    public function __construct(array $data) {
        $this->character_id = (int) $data['character_id'];
        $this->name         = $data['name'];
        $this->gender       = $data['gender'] ?? null;
        $this->age          = isset($data['age']) ? (int) $data['age'] : null;
        $this->description  = $data['description'] ?? null;
        $this->role         = $data['role'] ?? null;
        $this->pic          = $data['pic'] ?? null;
        $this->is_deleted   = (bool) $data['is_deleted'];
        $this->deleted_at   = $data['deleted_at'] ?? null;
    }

    public function toArray(): array {
        return [
            'character_id' => $this->character_id,
            'name'         => $this->name,
            'gender'       => $this->gender,
            'age'          => $this->age,
            'description'  => $this->description,
            'role'         => $this->role,
            'pic'          => $this->pic,
            'is_deleted'   => $this->is_deleted,
            'deleted_at'   => $this->deleted_at,
        ];
    }
}