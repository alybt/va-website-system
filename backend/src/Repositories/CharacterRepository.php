<?php

namespace App\Repositories;

use App\Models\Character;
use PDO;

class CharacterRepository {
    public function __construct(private PDO $db) {}

    public function findAll(array $filters = []): array {
        $where  = ['c.is_deleted = 0'];
        $params = [];

        if (!empty($filters['role'])) {
            $where[]          = 'c.role = :role';
            $params[':role']  = $filters['role'];
        }

        if (!empty($filters['gender'])) {
            $where[]            = 'c.gender = :gender';
            $params[':gender']  = $filters['gender'];
        }

        $sql  = 'SELECT * FROM characters c WHERE '
                . implode(' AND ', $where)
                . ' ORDER BY c.role ASC, c.name ASC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return array_map(
            fn($row) => (new Character($row))->toArray(),
            $stmt->fetchAll()
        );
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare(
            'SELECT * FROM characters
                WHERE character_id = :id AND is_deleted = 0'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();

        return $row ? (new Character($row))->toArray() : null;
    }

    public function findByArt(int $artId): array {
        $stmt = $this->db->prepare("
            SELECT c.character_id,
                    c.name,
                    c.gender,
                    c.age,
                    c.description,
                    c.role,
                    c.pic
            FROM   characters c
            INNER  JOIN art_characters ac ON ac.character_id = c.character_id
            WHERE  ac.art_id    = :art_id
                AND  c.is_deleted = 0
            ORDER  BY
                    FIELD(c.role, 'Main Cast', 'Supporting', 'Extra'),
                    c.name ASC
        ");
        $stmt->execute([':art_id' => $artId]);

        return array_map(
            fn(array $row) => Character::fromRow($row),
            $stmt->fetchAll()
        );
    }

    public function findByScript(int $scriptId): array {
        $stmt = $this->db->prepare(
            'SELECT c.*
                FROM characters c
                INNER JOIN script_characters sc ON sc.character_id = c.character_id
                WHERE sc.script_id = :script_id AND c.is_deleted = 0
                ORDER BY
                    FIELD(c.role, "Main Cast", "Supporting", "Extra"),
                    c.name ASC'
        );
        $stmt->execute([':script_id' => $scriptId]);

        return array_map(
            fn($row) => (new Character($row))->toArray(),
            $stmt->fetchAll()
        );
    }

    public function findByActor(int $actorId): array {
        $stmt = $this->db->prepare(
            'SELECT c.*
                FROM characters c
                INNER JOIN character_actors ca ON ca.character_id = c.character_id
                WHERE ca.actor_id = :actor_id AND c.is_deleted = 0
                ORDER BY c.name ASC'
        );
        $stmt->execute([':actor_id' => $actorId]);

        return array_map(
            fn($row) => (new Character($row))->toArray(),
            $stmt->fetchAll()
        );
    }

    public function search(string $query, int $limit = 20): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM characters
                WHERE is_deleted = 0
                    AND name LIKE :q
                ORDER BY name ASC
                LIMIT :limit'
        );
        $stmt->bindValue(':q',     '%' . $query . '%');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return array_map(
            fn($row) => (new Character($row))->toArray(),
            $stmt->fetchAll()
        );
    }


    public function create(array $data): array {
        $stmt = $this->db->prepare(
            'INSERT INTO characters (name, gender, age, description, role, pic)
                VALUES (:name, :gender, :age, :description, :role, :pic)'
        );
        $stmt->execute([
            ':name'        => $data['name'],
            ':gender'      => $data['gender']      ?? null,
            ':age'         => isset($data['age']) ? (int) $data['age'] : null,
            ':description' => $data['description'] ?? null,
            ':role'        => $data['role']         ?? null,
            ':pic'         => $data['pic']          ?? null,
        ]);

        return $this->findById((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): ?array {
        $stmt = $this->db->prepare(
            'UPDATE characters
                SET name        = :name,
                    gender      = :gender,
                    age         = :age,
                    description = :description,
                    role        = :role,
                    pic         = :pic
                WHERE character_id = :id AND is_deleted = 0'
        );
        $stmt->execute([
            ':name'        => $data['name'],
            ':gender'      => $data['gender']      ?? null,
            ':age'         => isset($data['age']) ? (int) $data['age'] : null,
            ':description' => $data['description'] ?? null,
            ':role'        => $data['role']         ?? null,
            ':pic'         => $data['pic']          ?? null,
            ':id'          => $id,
        ]);

        return $this->findById($id);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare(
            'UPDATE characters
                SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP
                WHERE character_id = :id AND is_deleted = 0'
        );
        $stmt->execute([':id' => $id]);

        return $stmt->rowCount() > 0;
    }

    public function assignActor(int $characterId, int $actorId): bool {
        $stmt = $this->db->prepare(
            'INSERT IGNORE INTO character_actors (character_id, actor_id)
                VALUES (:character_id, :actor_id)'
        );
        $stmt->execute([
            ':character_id' => $characterId,
            ':actor_id'     => $actorId,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function unassignActor(int $characterId, int $actorId): bool {
        $stmt = $this->db->prepare(
            'DELETE FROM character_actors
                WHERE character_id = :character_id AND actor_id = :actor_id'
        );
        $stmt->execute([
            ':character_id' => $characterId,
            ':actor_id'     => $actorId,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function unassignAllActors(int $characterId): void {
        $stmt = $this->db->prepare(
            'DELETE FROM character_actors WHERE character_id = :character_id'
        );
        $stmt->execute([':character_id' => $characterId]);
    }

    public function getAssignedActors(int $characterId): array {
        $stmt = $this->db->prepare(
            'SELECT a.*
                FROM actors a
                INNER JOIN character_actors ca ON ca.actor_id = a.actor_id
                WHERE ca.character_id = :character_id AND a.is_deleted = 0
                ORDER BY a.name ASC'
        );
        $stmt->execute([':character_id' => $characterId]);

        return $stmt->fetchAll();
    }


    public function linkToArt(int $characterId, int $artId): bool {
        $stmt = $this->db->prepare(
            'INSERT IGNORE INTO art_characters (art_id, character_id)
                VALUES (:art_id, :character_id)'
        );
        $stmt->execute([
            ':art_id'       => $artId,
            ':character_id' => $characterId,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function unlinkFromArt(int $characterId, int $artId): bool {
        $stmt = $this->db->prepare(
            'DELETE FROM art_characters
                WHERE art_id = :art_id AND character_id = :character_id'
        );
        $stmt->execute([
            ':art_id'       => $artId,
            ':character_id' => $characterId,
        ]);

        return $stmt->rowCount() > 0;
    }


    public function linkToScript(int $characterId, int $scriptId): bool {
        $stmt = $this->db->prepare(
            'INSERT IGNORE INTO script_characters (script_id, character_id)
                VALUES (:script_id, :character_id)'
        );
        $stmt->execute([
            ':script_id'    => $scriptId,
            ':character_id' => $characterId,
        ]);

        return $stmt->rowCount() > 0;
    }


    public function unlinkFromScript(int $characterId, int $scriptId): bool {
        $stmt = $this->db->prepare(
            'DELETE FROM script_characters
                WHERE script_id = :script_id AND character_id = :character_id'
        );
        $stmt->execute([
            ':script_id'    => $scriptId,
            ':character_id' => $characterId,
        ]);

        return $stmt->rowCount() > 0;
    }
}