<?php
namespace App\Repositories;

use PDO;

class ScriptRepository {
    private $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getAllScripts(int $currentUserId = null) { 
        $sql = "SELECT s.*, 
                (f.user_id IS NOT NULL) AS is_user_favorite
                FROM scripts s
                LEFT JOIN user_favorite_scripts f 
                    ON s.script_id = f.script_id 
                    AND f.user_id = :userId
                WHERE s.is_deleted = 0
                ORDER BY s.script_id DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute(['userId' => $currentUserId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}