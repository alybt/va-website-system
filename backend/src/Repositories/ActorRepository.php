<?php

namespace App\Repositories;

use App\Models\Actor;
use PDO;

class ActorRepository {
    public function __construct(private PDO $db) {}

    public function findAll(): array  {
        $stmt = $this->db->query("
            SELECT actor_id, name, gender, category, participation_status
            FROM   actors
            WHERE  is_deleted = 0
            ORDER  BY name ASC
        ");

        return array_map(
            fn(array $row) => Actor::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function findById(int $id): ?Actor {
        $stmt = $this->db->prepare("
            SELECT actor_id, name, gender, category, participation_status
            FROM   actors
            WHERE  actor_id = :id AND is_deleted = 0
        ");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? Actor::fromRow($row) : null;
    }

    public function create(array $data): Actor {
        $stmt = $this->db->prepare("
            INSERT INTO actors (name, gender, category, participation_status)
            VALUES (:name, :gender, :category, :participation_status)
        ");
        $stmt->execute([
            ':name'                 => $data['name'],
            ':gender'               => $data['gender']               ?? null,
            ':category'             => $data['category']             ?? null,
            ':participation_status' => $data['participation_status'] ?? '1st',
        ]);

        $id = (int) $this->db->lastInsertId();
        return $this->findById($id);
    }

    public function update(int $id, array $data): ?Actor
    {
        $stmt = $this->db->prepare("
            UPDATE actors
            SET     name                 = :name,
                    gender               = :gender,
                    category             = :category,
                    participation_status = :participation_status
            WHERE  actor_id = :id AND is_deleted = 0
        ");
        $stmt->execute([
            ':id'                   => $id,
            ':name'                 => $data['name'],
            ':gender'               => $data['gender']               ?? null,
            ':category'             => $data['category']             ?? null,
            ':participation_status' => $data['participation_status'] ?? '1st',
        ]);

        return $this->findById($id);
    }

    public function softDelete(int $id): bool {
        $stmt = $this->db->prepare("
            UPDATE actors
            SET    is_deleted = 1, deleted_at = NOW()
            WHERE  actor_id = :id AND is_deleted = 0
        ");
        $stmt->execute([':id' => $id]);

        return $stmt->rowCount() > 0;
    }
}