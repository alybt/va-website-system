<?php

namespace App\Repositories;

use App\Models\Actor;
use PDO;

class ActorRepository {
    public function __construct(private PDO $db) {}

    public function findAll(): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM actors WHERE is_deleted = 0 ORDER BY name ASC'
        );
        $stmt->execute();
        return array_map(fn($row) => (new Actor($row))->toArray(), $stmt->fetchAll());
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare(
            'SELECT * FROM actors WHERE actor_id = :id AND is_deleted = 0'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ? (new Actor($row))->toArray() : null;
    }

    public function create(array $data): array {
        $stmt = $this->db->prepare(
            'INSERT INTO actors (name, gender, category)
                VALUES (:name, :gender, :category)'
        );
        $stmt->execute([
            ':name'     => $data['name'],
            ':gender'   => $data['gender']   ?? null,
            ':category' => $data['category'] ?? null,
        ]);
        return $this->findById((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): ?array {
        $stmt = $this->db->prepare(
            'UPDATE actors
                SET name = :name, gender = :gender, category = :category
                WHERE actor_id = :id AND is_deleted = 0'
        );
        $stmt->execute([
            ':name'     => $data['name'],
            ':gender'   => $data['gender']   ?? null,
            ':category' => $data['category'] ?? null,
            ':id'       => $id,
        ]);
        return $this->findById($id);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare(
            'UPDATE actors
                SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP
                WHERE actor_id = :id AND is_deleted = 0'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount() > 0;
    }
}