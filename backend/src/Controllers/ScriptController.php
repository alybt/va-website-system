<?php
namespace App\Controllers;

use App\Repositories\ScriptRepository;
use App\Config\Database;

class ScriptController {
    public function index() {
        $db = (new Database())->getConnection();
        $repo = new ScriptRepository($db); 
        
        $userId = $_GET['user_id'] ?? 0; 

        $scripts = $repo->getAllScripts((int)$userId);
        
        header('Content-Type: application/json');
        echo json_encode($scripts);
    }
}