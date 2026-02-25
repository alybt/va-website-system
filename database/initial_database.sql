-- ================================
-- DATABASE
-- ================================
CREATE DATABASE IF NOT EXISTS va_website;
USE va_website;

-- ================================
-- USERS
-- ================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    status ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
    role ENUM('admin', 'user') NOT NULL,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_not_deleted ON users(is_deleted);

-- ================================
-- SCRIPTS
-- ================================
CREATE TABLE scripts (
    script_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    runtime_minutes INT,
    genre VARCHAR(100),
    recommended_music VARCHAR(150),
    author_note TEXT,
    created_by INT,

    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE INDEX idx_scripts_not_deleted ON scripts(is_deleted);

-- ================================
-- SEQUENTIAL ART
-- ================================
CREATE TABLE sequential_art (
    art_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(100),
    type ENUM('Webtoon', 'Manhwa', 'Manhua', 'Manga', 'Western Comics'),
    added_by INT,

    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (added_by) REFERENCES users(user_id)
);

CREATE INDEX idx_art_not_deleted ON sequential_art(is_deleted);

-- ================================
-- CHARACTERS
-- ================================
CREATE TABLE characters (
    character_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    age INT,
    description TEXT,
    role ENUM('Main Cast', 'Supporting', 'Extra'),

    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_characters_not_deleted ON characters(is_deleted);

-- ================================
-- ACTORS
-- ================================
CREATE TABLE actors (
    actor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    category ENUM('Main Cast', 'Extra', 'Minor Role', 'Kid'),

    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_actors_not_deleted ON actors(is_deleted);

-- ================================
-- SCRIPT ↔ CHARACTERS (Many-to-Many)
-- ================================
CREATE TABLE script_characters (
    script_id INT,
    character_id INT,
    PRIMARY KEY (script_id, character_id),
    FOREIGN KEY (script_id) REFERENCES scripts(script_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE
);

-- ================================
-- ART ↔ CHARACTERS (Many-to-Many)
-- ================================
CREATE TABLE art_characters (
    art_id INT,
    character_id INT,
    PRIMARY KEY (art_id, character_id),
    FOREIGN KEY (art_id) REFERENCES sequential_art(art_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE
);

-- ================================
-- CHARACTER ↔ ACTORS (Casting)
-- ================================
CREATE TABLE character_actors (
    character_id INT,
    actor_id INT,
    PRIMARY KEY (character_id, actor_id),
    FOREIGN KEY (character_id) REFERENCES characters(character_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(actor_id) ON DELETE CASCADE
);

-- ================================
-- USER FAVORITES (SCRIPTS)
-- ================================
CREATE TABLE user_favorite_scripts (
    user_id INT,
    script_id INT,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, script_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (script_id) REFERENCES scripts(script_id) ON DELETE CASCADE
);

-- ================================
-- USER FAVORITES (SEQUENTIAL ART)
-- ================================
CREATE TABLE user_favorite_sequential_art (
    user_id INT,
    art_id INT,
    favorited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, art_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (art_id) REFERENCES sequential_art(art_id) ON DELETE CASCADE
);

-- ================================
-- USER ACTIVITIES (Audit Log)
-- ================================
CREATE TABLE user_activities (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM(
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'EDIT_PROFILE',
        'ADD_SCRIPT',
        'EDIT_SCRIPT',
        'DELETE_SCRIPT',
        'ADD_ART',
        'EDIT_ART',
        'DELETE_ART',
        'ADD_FAVORITE',
        'REMOVE_FAVORITE'
    ) NOT NULL,
    target_type ENUM('SCRIPT', 'ART', 'PROFILE') NULL,
    target_id INT NULL,
    activity_description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_activities_user ON user_activities(user_id);