<?php
namespace App\Models;

class SequentialArt {
    public int $art_id;
    public string $title;
    public ?string $genre;
    public string $type;  
    public int $added_by;
    public bool $is_deleted;
    public ?string $deleted_at;
}