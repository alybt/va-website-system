<?php
namespace App\Repositories;

use PDO;

class SequentialArtRepository {
    public function __construct(private PDO $db) {}

    public function findAll(): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM sequential_art WHERE is_deleted = 0 ORDER BY title ASC'
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare(
            'SELECT * FROM sequential_art WHERE art_id = :id AND is_deleted = 0'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}