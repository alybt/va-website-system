<?php

namespace App\Repositories;

use PDO;

class ScriptRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAllScripts(array $filters = []): array {
        
        $conditions = ['(s.is_deleted IS NULL OR s.is_deleted = 0)'];
        $params     = [];

        if (!empty($filters['search'])) {
            $conditions[] = 's.title LIKE :search';
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['genre'])) {
            $conditions[] = 's.genre = :genre';
            $params[':genre'] = $filters['genre'];
        }

        if (!empty($filters['created_by'])) {
            $conditions[] = 's.created_by = :created_by';
            $params[':created_by'] = (int) $filters['created_by'];
        }

        if (!empty($filters['max_runtime'])) {
            $conditions[] = 's.runtime_minutes <= :max_runtime';
            $params[':max_runtime'] = (int) $filters['max_runtime'];
        }

        if (!empty($filters['max_cast'])) {
            $conditions[] = 's.cast_size <= :max_cast';
            $params[':max_cast'] = (int) $filters['max_cast'];
        }

        $where = implode(' AND ', $conditions);

        $sql = "
            SELECT
                s.script_id,
                s.title,
                s.runtime_minutes,
                s.genre,
                s.recommended_music,
                s.author_note,
                s.cast_size,
                s.created_by,
                u.username AS author_name
            FROM scripts s
            LEFT JOIN users u
                ON u.user_id = s.created_by
                AND (u.is_deleted IS NULL OR u.is_deleted = 0)
            WHERE {$where}
            ORDER BY s.title ASC
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGenres(): array {
        $stmt = $this->db->query("
            SELECT DISTINCT genre
            FROM scripts
            WHERE (is_deleted IS NULL OR is_deleted = 0)
                AND genre IS NOT NULL
                AND genre != ''
            ORDER BY genre ASC
        ");
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getAuthors(): array {
        $stmt = $this->db->query("
            SELECT DISTINCT u.user_id, u.username
            FROM scripts s
            JOIN users u
                ON u.user_id = s.created_by
                AND (u.is_deleted IS NULL OR u.is_deleted = 0)
            WHERE (s.is_deleted IS NULL OR s.is_deleted = 0)
            ORDER BY u.username ASC
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}