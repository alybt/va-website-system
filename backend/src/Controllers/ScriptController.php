<?php
namespace App\Controllers;

use App\Repositories\ScriptRepository;
use App\Config\Database;

class ScriptController {
    public function index(): void
    {
        $db   = (new Database())->getConnection();
        $repo = new ScriptRepository($db);

        // ── legacy param (kept for backward-compat) ────────────────
        $userId = (int) ($_GET['user_id'] ?? 0);

        // ── filter params from query string ────────────────────────
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

        if (isset($_GET['max_runtime']) && $_GET['max_runtime'] !== '') {
            $filters['max_runtime'] = (int) $_GET['max_runtime'];
        }

        if (isset($_GET['max_cast']) && $_GET['max_cast'] !== '') {
            $filters['max_cast'] = (int) $_GET['max_cast'];
        }

        $scripts = $repo->getAllScripts($userId, $filters);

        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'count'  => count($scripts),
            'data'   => $scripts,
        ]);
    }

    public function meta(): void
    {
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