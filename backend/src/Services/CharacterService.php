<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Character;
use App\Repositories\CharacterRepository;
use InvalidArgumentException;

class CharacterService {
    public function __construct(private readonly CharacterRepository $repo) {}

    public function getByArt(int $artId): array {
        if ($artId <= 0) {
            throw new InvalidArgumentException('art_id must be a positive integer.');
        }

        return $this->repo->findByArt($artId);
    }
}