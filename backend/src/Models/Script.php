<?php
namespace App\Models;

class Script {
    public int $script_id;
    public string $title;
    public ?int $runtime_minutes;
    public ?string $genre;
    public ?string $recommended_music;
    public ?string $author_note;
    public int $created_by;
    public bool $is_deleted;
    public ?string $deleted_at;
}