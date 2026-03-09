<?php
namespace App\Controllers;

use App\Repositories\ScriptRepository;
use App\Config\Database;

class ScriptController {
    public function index(): void {
        $db   = (new Database())->getConnection();
        $repo = new ScriptRepository($db); 
        $filters = [];

        if (isset($_GET['search']) && $_GET['search'] !== '') {
            $filters['search'] = trim($_GET['search']);
        }

        if (isset($_GET['genre']) && $_GET['genre'] !== '') {
            $filters['genre'] = trim($_GET['genre']);
        }

        if (isset($_GET['created_by']) && $_GET['created_by'] !== '') {
            $filters['created_by'] = (int) $_GET['created_by'];
        }

        if (isset($_GET['runtime_minutes']) && $_GET['runtime_minutes'] !== '') {
            $filters['runtime_minutes'] = (int) $_GET['runtime_minutes'];
        }

        if (isset($_GET['cast_size']) && $_GET['cast_size'] !== '') {
            $filters['cast_size'] = (int) $_GET['cast_size'];
        }

        $scripts = $repo->getAllScripts( $filters);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'count'  => count($scripts),
            'data'   => $scripts,
        ]);
    }

    public function meta(): void {
        $db   = (new Database())->getConnection();
        $repo = new ScriptRepository($db);

        header('Content-Type: application/json');
        echo json_encode([
            'status'  => 'success',
            'genres'  => $repo->getGenres(),
            'authors' => $repo->getAuthors(),
        ]);
    }

}