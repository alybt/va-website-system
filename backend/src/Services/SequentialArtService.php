<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\SequentialArt;
use App\Repositories\SequentialArtRepository;

class SequentialArtService {
    public function __construct(private readonly SequentialArtRepository $repo) {}

    public function getAll(): array {
        return $this->repo->findAll();
    }
}