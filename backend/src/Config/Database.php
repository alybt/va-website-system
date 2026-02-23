<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private $host = "127.0.0.1";
    private $db_name = "vawebsite";
    private $username = "root"; 
    private $password = "";     

    public function getConnection() {
        try {
            $conn = new PDO(
                "mysql:host=" . $this->host . ";port=3307;dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
            return null;
        }
    }
}