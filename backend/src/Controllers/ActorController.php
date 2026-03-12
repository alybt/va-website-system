<?php

namespace App\Controllers;

use App\Repositories\ActorRepository;

class ActorController {
    public function __construct(private ActorRepository $repo) {}

    public function handle(string $method, array $segments, ?array $body): void { 
        $id = isset($segments[1]) ? (int) $segments[1] : null;

        match (true) {
            $method === 'GET'    && $id === null => $this->index(),
            $method === 'GET'    && $id !== null => $this->show($id),
            $method === 'POST'   && $id === null => $this->store($body),
            $method === 'PUT'    && $id !== null => $this->update($id, $body),
            $method === 'DELETE' && $id !== null => $this->destroy($id),
            default                              => $this->notFound(),
        };
    }

    private function index(): void {
        $this->json($this->repo->findAll());
    }

    private function show(int $id): void {
        $actor = $this->repo->findById($id);
        $actor ? $this->json($actor) : $this->notFound();
    }

    private function store(?array $body): void {
        if (empty($body['name'])) {
            $this->error(422, 'name is required');
            return;
        }
        $this->json($this->repo->create($body), 201);
    }

    private function update(int $id, ?array $body): void {
        if (empty($body['name'])) {
            $this->error(422, 'name is required');
            return;
        }
        $actor = $this->repo->update($id, $body);
        $actor ? $this->json($actor) : $this->notFound();
    }

    private function destroy(int $id): void {
        $ok = $this->repo->delete($id);
        $ok
            ? $this->json(['message' => 'Actor deleted'])
            : $this->notFound();
    }

    private function json(mixed $data, int $status = 200): void {
        http_response_code($status);
        echo json_encode(['status' => 'success', 'data' => $data]);
    }

    private function error(int $status, string $message): void {
        http_response_code($status);
        echo json_encode(['status' => 'error', 'message' => $message]);
    }

    private function notFound(): void {
        $this->error(404, 'Actor not found');
    }
}