<?php

namespace App\Models;

class Actor{
    public int $actor_id;
    public string $name;
    public ?string $gender;
    public ?string $category;
    public bool $is_deleted;
    public ?string $deleted_at;

    public function __construct(array $data) {
        $this->actor_id   = (int) $data['actor_id'];
        $this->name       = $data['name'];
        $this->gender     = $data['gender'] ?? null;
        $this->category   = $data['category'] ?? null;
        $this->is_deleted = (bool) $data['is_deleted'];
        $this->deleted_at = $data['deleted_at'] ?? null;
    }

    public function toArray(): array {
        return [
            'actor_id'   => $this->actor_id,
            'name'       => $this->name,
            'gender'     => $this->gender,
            'category'   => $this->category,
            'is_deleted' => $this->is_deleted,
            'deleted_at' => $this->deleted_at,
        ];
    }
}