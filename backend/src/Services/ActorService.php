<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Actor;
use App\Repositories\ActorRepository;
use InvalidArgumentException;

class ActorService
{
    public function __construct(private readonly ActorRepository $repo) {}

    /** @return Actor[] */
    public function getAll(): array {
        return $this->repo->findAll();
    }

    public function create(array $data): Actor {
        $this->validatePayload($data);
        return $this->repo->create($data);
    }

    public function update(int $id, array $data): Actor {
        $this->validatePayload($data);

        $actor = $this->repo->update($id, $data);

        if ($actor === null) {
            throw new InvalidArgumentException("Actor #{$id} not found.");
        }

        return $actor;
    }

    public function delete(int $id): void {
        $deleted = $this->repo->softDelete($id);

        if (!$deleted) {
            throw new InvalidArgumentException("Actor #{$id} not found.");
        }
    } 

    private function validatePayload(array $data): void {
        if (empty($data['name']) || trim($data['name']) === '') {
            throw new InvalidArgumentException('Actor name is required.');
        }

        $allowedGenders = ['Male', 'Female', 'Other'];
        if (isset($data['gender']) && $data['gender'] !== null
            && !in_array($data['gender'], $allowedGenders, true)) {
            throw new InvalidArgumentException('Invalid gender value.');
        }

        $allowedCategories = ['Main Cast', 'Extra', 'Minor Role', 'Kid'];
        if (isset($data['category']) && $data['category'] !== null
            && !in_array($data['category'], $allowedCategories, true)) {
            throw new InvalidArgumentException('Invalid category value.');
        }

        $allowedStatuses = ['1st', '2nd', '3rd'];
        if (isset($data['participation_status'])
            && !in_array($data['participation_status'], $allowedStatuses, true)) {
            throw new InvalidArgumentException('Invalid participation_status value.');
        }
    }
}