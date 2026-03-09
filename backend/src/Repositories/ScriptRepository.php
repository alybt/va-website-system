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
            $params['genre'] = $filters['genre'];
        }

        if (!empty($filters['created_by'])) {
            $conditions[] = 's.created_by = :created_by';
            $params['created_by'] = (int) $filters['created_by'];
        }

        if (!empty($filters['runtime_minutes'])) {
            $conditions[] = 's.runtime_minutes = :runtime_minutes';
            $params['runtime_minutes'] = (int) $filters['runtime_minutes'];
        }

        if (!empty($filters['cast_size'])) {
            $conditions[] = 's.cast_size = :cast_size';
            $params['cast_size'] = (int) $filters['cast_size'];
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