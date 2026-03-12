<?php

namespace App\Controllers;

use App\Repositories\CharacterRepository;

class CharacterController {
    public function __construct(private CharacterRepository $repo) {}

    public function handle(string $method, array $segments, ?array $body): void { 
        $sub = $segments[1] ?? null;

        match (true) {
            $method === 'GET'    && $sub === null          => $this->index(),
            $method === 'GET'    && $sub === 'by-art'      => $this->byArt((int)($segments[2] ?? 0)),
            $method === 'GET'    && $sub === 'by-script'   => $this->byScript((int)($segments[2] ?? 0)),
            $method === 'GET'    && is_numeric($sub)       => $this->show((int) $sub),
            $method === 'POST'   && $sub === null          => $this->store($body),
            $method === 'PUT'    && is_numeric($sub)       => $this->update((int) $sub, $body),
            $method === 'DELETE' && is_numeric($sub)       => $this->destroy((int) $sub),
            default                                        => $this->notFound(),
        };
    }

    private function index(): void {
        $this->json($this->repo->findAll());
    }

    private function show(int $id): void {
        $char = $this->repo->findById($id);
        $char ? $this->json($char) : $this->notFound();
    }

    private function byArt(int $artId): void {
        $this->json($this->repo->findByArt($artId));
    }

    private function byScript(int $scriptId): void {
        $this->json($this->repo->findByScript($scriptId));
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
        $char = $this->repo->update($id, $body);
        $char ? $this->json($char) : $this->notFound();
    }

    private function destroy(int $id): void {
        $ok = $this->repo->delete($id);
        $ok
            ? $this->json(['message' => 'Character deleted'])
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
        $this->error(404, 'Character not found');
    }
}