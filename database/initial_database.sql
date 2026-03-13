SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- ACTORS
-- --------------------------------------------------------

CREATE TABLE `actors` (
    `actor_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `gender` enum('Male','Female','Other') DEFAULT NULL,
    `category` enum('Main Cast','Extra','Minor Role','Kid') DEFAULT NULL,
    `participation_status` ENUM('available', 'participating', 'extra') DEFAULT 'available',
    `is_deleted` tinyint(1) DEFAULT 0,
    `deleted_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`actor_id`),
    KEY `idx_actors_not_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- CHARACTERS
-- --------------------------------------------------------

CREATE TABLE `characters` (
    `character_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `gender` enum('Male','Female','Other') DEFAULT NULL,
    `age` int(11) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `role` enum('Main Cast','Supporting','Extra') DEFAULT NULL,
    `pic` varchar(255) DEFAULT NULL,
    `is_deleted` tinyint(1) DEFAULT 0,
    `deleted_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`character_id`),
    KEY `idx_characters_not_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- USERS
-- --------------------------------------------------------

CREATE TABLE `users` (
    `user_id` int(11) NOT NULL AUTO_INCREMENT,
    `username` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `pfp` varchar(225) NOT NULL,
    `bio` text DEFAULT NULL,
    `status` enum('pending','active','suspended') DEFAULT 'pending',
    `role` enum('admin','user') NOT NULL,
    `last_active` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `is_deleted` tinyint(1) DEFAULT 0,
    `deleted_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `username` (`username`),
    KEY `idx_users_not_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- SCRIPTS
-- --------------------------------------------------------

CREATE TABLE `scripts` (
    `script_id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(150) NOT NULL,
    `script_body` LONGTEXT,
    `runtime_minutes` int(11) DEFAULT NULL,
    `genre` varchar(100) DEFAULT NULL,
    `recommended_music` varchar(150) DEFAULT NULL,
    `author_note` text DEFAULT NULL,
    `created_by` int(11) DEFAULT NULL,
    `is_deleted` tinyint(1) DEFAULT 0,
    `deleted_at` timestamp NULL DEFAULT NULL,
    `cast_size` int(11) NOT NULL,
    PRIMARY KEY (`script_id`),
    KEY `created_by` (`created_by`),
    KEY `idx_scripts_not_deleted` (`is_deleted`),
    CONSTRAINT `scripts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- SEQUENTIAL_ART
-- --------------------------------------------------------

CREATE TABLE `sequential_art` (
    `art_id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(150) NOT NULL,
    `genre` varchar(100) DEFAULT NULL,
    `type` enum('Webtoon','Manhwa','Manhua','Manga','Western Comics') DEFAULT NULL,
    `added_by` int(11) DEFAULT NULL,
    `is_deleted` tinyint(1) DEFAULT 0,
    `deleted_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`art_id`),
    KEY `added_by` (`added_by`),
    KEY `idx_art_not_deleted` (`is_deleted`),
    CONSTRAINT `sequential_art_ibfk_1` FOREIGN KEY (`added_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- ART_CHARACTERS
-- --------------------------------------------------------

CREATE TABLE `art_characters` (
    `art_id` int(11) NOT NULL,
    `character_id` int(11) NOT NULL,
    PRIMARY KEY (`art_id`,`character_id`),
    KEY `character_id` (`character_id`),
    CONSTRAINT `art_characters_ibfk_1` FOREIGN KEY (`art_id`) REFERENCES `sequential_art` (`art_id`) ON DELETE CASCADE,
    CONSTRAINT `art_characters_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `characters` (`character_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `character_actors` (
    `character_id` int(11) NOT NULL,
    `actor_id` int(11) NOT NULL,
    PRIMARY KEY (`character_id`,`actor_id`),
    KEY `actor_id` (`actor_id`),
    CONSTRAINT `character_actors_ibfk_1` FOREIGN KEY (`character_id`) REFERENCES `characters` (`character_id`) ON DELETE CASCADE,
    CONSTRAINT `character_actors_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `actors` (`actor_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- SCRIPT CHARACTERS
-- --------------------------------------------------------

CREATE TABLE `script_characters` (
    `script_id` int(11) NOT NULL,
    `character_id` int(11) NOT NULL,
    PRIMARY KEY (`script_id`,`character_id`),
    KEY `character_id` (`character_id`),
    CONSTRAINT `script_characters_ibfk_1` FOREIGN KEY (`script_id`) REFERENCES `scripts` (`script_id`) ON DELETE CASCADE,
    CONSTRAINT `script_characters_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `characters` (`character_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- USER ACTIVITIES
-- --------------------------------------------------------

CREATE TABLE `user_activities` (
    `activity_id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `activity_type` enum('LOGIN','LOGOUT','REGISTER','EDIT_PROFILE','ADD_SCRIPT','EDIT_SCRIPT','DELETE_SCRIPT','ADD_ART','EDIT_ART','DELETE_ART','ADD_FAVORITE','REMOVE_FAVORITE') NOT NULL,
    `target_type` enum('SCRIPT','ART','PROFILE') DEFAULT NULL,
    `target_id` int(11) DEFAULT NULL,
    `activity_description` text DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`activity_id`),
    KEY `idx_user_activities_user` (`user_id`),
    CONSTRAINT `user_activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- USER_FAVORITE_SCRIPTS
-- --------------------------------------------------------

CREATE TABLE `user_favorite_scripts` (
    `user_id` int(11) NOT NULL,
    `script_id` int(11) NOT NULL,
    `favorited_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`user_id`,`script_id`),
    KEY `script_id` (`script_id`),
    CONSTRAINT `user_favorite_scripts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `user_favorite_scripts_ibfk_2` FOREIGN KEY (`script_id`) REFERENCES `scripts` (`script_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- USER_FAVORITE_SEQUENTIAL_ART
-- --------------------------------------------------------

CREATE TABLE `user_favorite_sequential_art` (
    `user_id` int(11) NOT NULL,
    `art_id` int(11) NOT NULL,
    `favorited_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`user_id`,`art_id`),
    KEY `art_id` (`art_id`),
    CONSTRAINT `user_favorite_sequential_art_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `user_favorite_sequential_art_ibfk_2` FOREIGN KEY (`art_id`) REFERENCES `sequential_art` (`art_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
