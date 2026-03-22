-- USER
CREATE TABLE user (
    user_id INT(11) NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
    pfp VARCHAR(255) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    status ENUM('Pending', 'Active', 'Suspended', 'Deleted') DEFAULT 'Pending',
    role ENUM('Admin', 'User') NOT NULL,
    last_active TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
    is_deleted TINYINT(1) DEFAULT 0,
    deleted_at TIMESTAMP DEFAULT NULL,

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_user_name (user_name),
    KEY idx_user_active (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ACTORS
CREATE TABLE actors (
    actor_id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
    category ENUM('Main', 'Minor', 'Extra') DEFAULT NULL,
    participation_counter INT NOT NULL DEFAULT 1,
    is_deleted TINYINT(1) DEFAULT 0,
    deleted_at TIMESTAMP DEFAULT NULL,

    PRIMARY KEY (actor_id),
    KEY idx_actors_active (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CHARACTERS
CREATE TABLE characters (
    character_id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    gender ENUM('Male', 'Female', 'Other') DEFAULT NULL,
    role ENUM('Main', 'Minor', 'Extra') DEFAULT NULL,
    pic VARCHAR(255) DEFAULT NULL,
    is_deleted TINYINT(1) DEFAULT 0,
    deleted_at TIMESTAMP DEFAULT NULL,

    PRIMARY KEY (character_id),
    KEY idx_characters_active (is_deleted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ART
CREATE TABLE sequential_art (
    art_id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    type ENUM('Comic', 'Manga', 'Webtoon', 'Other') DEFAULT NULL,
    added_by INT(11) DEFAULT NULL,   
    note TEXT DEFAULT NULL,
    status ENUM('Draft', 'Pending', 'Published', 'Archived') DEFAULT 'Draft',
    is_deleted TINYINT(1) DEFAULT 0,
    deleted_at TIMESTAMP DEFAULT NULL,

    PRIMARY KEY (art_id),
    KEY idx_art_active (is_deleted),
    KEY idx_art_user (added_by),
    CONSTRAINT fk_art_added_by FOREIGN KEY (added_by) REFERENCES user (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- SCRIPT
CREATE TABLE script (
    script_id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    body LONGTEXT DEFAULT NULL,
    runtime ENUM('Flash', 'Short', 'Medium', 'Long', 'Epic') DEFAULT NULL,
    genre VARCHAR(100) DEFAULT NULL,
    added_by INT(11) DEFAULT NULL,  
    author_note TEXT DEFAULT NULL,
    status ENUM('Draft', 'Pending', 'Published', 'Archived') DEFAULT 'Draft',
    is_deleted TINYINT(1) DEFAULT 0,
    deleted_at TIMESTAMP DEFAULT NULL,

    PRIMARY KEY (script_id),
    KEY idx_script_active (is_deleted),
    KEY idx_script_user (added_by),
    CONSTRAINT fk_script_added_by FOREIGN KEY (added_by) REFERENCES user (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RECOMMENDED MUSIC
CREATE TABLE recommended_music (
    music_id INT(11) NOT NULL AUTO_INCREMENT,
    link VARCHAR(500) NOT NULL,
    target_type ENUM('SCRIPT', 'ART') NOT NULL,
    targeted_id INT(11)  NOT NULL,

    PRIMARY KEY (music_id),
    KEY idx_music_target (target_type, targeted_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SCRIPT CHARACTER
CREATE TABLE script_character (
    script_id INT(11) NOT NULL,
    character_id INT(11) NOT NULL,

    PRIMARY KEY (script_id, character_id),
    KEY idx_sc_character (character_id),
    CONSTRAINT fk_sc_script FOREIGN KEY (script_id) REFERENCES script (script_id) ON DELETE CASCADE,
    CONSTRAINT fk_sc_character FOREIGN KEY (character_id) REFERENCES characters (character_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ART CHARACTER
CREATE TABLE art_character (
    art_id INT(11) NOT NULL,
    character_id INT(11) NOT NULL,

    PRIMARY KEY (art_id, character_id),
    KEY idx_ac_character (character_id),
    CONSTRAINT fk_ac_art FOREIGN KEY (art_id) REFERENCES sequential_art (art_id) ON DELETE CASCADE,
    CONSTRAINT fk_ac_character FOREIGN KEY (character_id) REFERENCES characters (character_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- FAVORITE ART
CREATE TABLE favorite_art (
    user_id INT(11) NOT NULL,
    art_id INT(11) NOT NULL,

    PRIMARY KEY (user_id, art_id),
    KEY idx_fa_art (art_id),
    CONSTRAINT fk_fa_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_fa_art FOREIGN KEY (art_id) REFERENCES sequential_art (art_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAVORITE SCRIPT
CREATE TABLE favorite_script (
    user_id   INT(11) NOT NULL,
    script_id INT(11) NOT NULL,

    PRIMARY KEY (user_id, script_id),
    KEY idx_fs_script (script_id),
    CONSTRAINT fk_fs_user   FOREIGN KEY (user_id)   REFERENCES user   (user_id)   ON DELETE CASCADE,
    CONSTRAINT fk_fs_script FOREIGN KEY (script_id) REFERENCES script (script_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ACTIVITIES 
CREATE TABLE user_activities (
    activity_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) DEFAULT NULL,
    activity_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) DEFAULT NULL,
    targeted_id INT(11) DEFAULT NULL,
    activity_description TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),

    PRIMARY KEY (activity_id),
    KEY idx_ua_user   (user_id),
    KEY idx_ua_target (target_type, targeted_id),
    CONSTRAINT fk_ua_user FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;