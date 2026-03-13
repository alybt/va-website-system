<?php
// backend/src/Controllers/SequentialArtController.php

namespace App\Controllers;

use App\Repositories\SequentialArtRepository;

class SequentialArtController {
    public function __construct(private SequentialArtRepository $repo) {}

    public function handle(string $method, array $segments): void {
        $id = isset($segments[1]) && is_numeric($segments[1])
            ? (int) $segments[1]
            : null;

        match (true) {
            $method === 'GET' && $id === null => $this->index(),
            $method === 'GET' && $id !== null => $this->show($id),
            default                           => $this->notFound(),
        };
    }

    private function index(): void {
        $this->json($this->repo->findAll());
    }

    private function show(int $id): void {
        $art = $this->repo->findById($id);
        $art ? $this->json($art) : $this->notFound();
    }

    private function json(mixed $data, int $status = 200): void {
        http_response_code($status);
        echo json_encode(['status' => 'success', 'data' => $data]);
    }

    private function notFound(): void {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Not found']);
    }
}