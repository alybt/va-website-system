<?php
namespace App\Controllers;

use App\Config\Database;
use PDO;

class RegisterController {
    public function register() {
        // 1. Get JSON data from React
        $data = json_decode(file_get_contents("php://input"), true);

        // 2. Validate input
        if (empty($data['username']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(["message" => "Missing username or password"]);
            return;
        }

        try {
            // 3. Connect to Database
            $db = (new Database())->getConnection();
            
            if (!$db) {
                http_response_code(500);
                echo json_encode(["message" => "Database connection failed! Check your Config/Database.php credentials."]);
                return;
            }

            // 4. Hash the password
            $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

            // 5. Prepare and Execute
            $query = "INSERT INTO users (username, password, role, status) VALUES (?, ?, '?', 'pending')";
            $stmt = $db->prepare($query);
            $stmt->execute([
                $data['username'], 
                $hashedPassword, 
                $data['role'] ?? 'writer'
            ]);

            // 6. Success!
            echo json_encode(["message" => "User registered successfully!"]);

        } catch (\PDOException $e) {
            http_response_code(500);
            // This will tell you if a column is missing or the table name is wrong
            echo json_encode(["message" => "SQL Error: " . $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "General Error: " . $e->getMessage()]);
        }
    }
}