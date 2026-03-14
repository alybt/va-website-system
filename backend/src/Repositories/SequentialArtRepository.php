<?php
namespace App\Repositories;

use PDO;

class SequentialArtRepository {
    public function __construct(private PDO $db) {}

    public function findAll(): array {
        $stmt = $this->db->query("
            SELECT art_id, title, genre, type
            FROM   sequential_art
            WHERE  is_deleted = 0
            ORDER  BY title ASC
        "); 
        
        return array_map(
            fn(array $row) => SequentialArt::fromRow($row),
            $stmt->fetchAll()
        );
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