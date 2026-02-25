<?php
namespace App\Controllers;

use App\Config\Database;

class FavoriteController {
    public function toggle() {
        $data = json_decode(file_get_contents("php://input"), true);
        $userId = $data['user_id'];
        $scriptId = $data['script_id'];

        $db = (new Database())->getConnection();

        // 1. Check if it already exists
        $check = $db->prepare("SELECT 1 FROM user_favorite_scripts WHERE user_id = ? AND script_id = ?");
        $check->execute([$userId, $scriptId]);

        if ($check->fetch()) {
            // 2. If exists, REMOVE it
            $stmt = $db->prepare("DELETE FROM user_favorite_scripts WHERE user_id = ? AND script_id = ?");
            $stmt->execute([$userId, $scriptId]);
            echo json_encode(["status" => "removed"]);
        } else {
            // 3. If NOT exists, ADD it
            $stmt = $db->prepare("INSERT INTO user_favorite_scripts (user_id, script_id) VALUES (?, ?)");
            $stmt->execute([$userId, $scriptId]);
            echo json_encode(["status" => "added"]);
        }
    }
}