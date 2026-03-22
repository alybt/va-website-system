-- =============================================================
--  SAMPLE DATA
--  Order matters — parent tables first, junction tables last
-- =============================================================

-- -------------------------------------------------------------
--  USER
--  Passwords are bcrypt hashes of 'Password123!'
-- -------------------------------------------------------------
INSERT INTO user (user_name, password, gender, pfp, bio, status, role) VALUES
('admin_rei',    '$2b$12$KIXabc1234examplehashAA', 'Female', 'pfp/rei.jpg',    'Site administrator.',              'Active',  'Admin'),
('kurosawa_jun', '$2b$12$KIXabc1234examplehashBB', 'Male',   'pfp/jun.jpg',    'Screenwriter and comic enthusiast.','Active', 'User'),
('mika_tanaka',  '$2b$12$KIXabc1234examplehashCC', 'Female', 'pfp/mika.jpg',   'I write short scripts for fun.',   'Active',  'User'),
('ghost_user',   '$2b$12$KIXabc1234examplehashDD', NULL,     NULL,              NULL,                               'Pending', 'User'),
('banned_one',   '$2b$12$KIXabc1234examplehashEE', 'Other',  NULL,              NULL,                               'Suspended','User');


-- -------------------------------------------------------------
--  ACTORS
-- -------------------------------------------------------------
INSERT INTO actors (name, gender, category, participation_counter) VALUES
('Lena Cruz',      'Female', 'Main',  5),
('Marco Reyes',    'Male',   'Main',  3),
('Sofia Dela Paz', 'Female', 'Minor', 2),
('Ryan Ong',       'Male',   'Extra', 1),
('Jamie Santos',   'Other',  'Minor', 4);


-- -------------------------------------------------------------
--  CHARACTERS
-- -------------------------------------------------------------
INSERT INTO characters (name, description, gender, role, pic) VALUES
('Elara Voss',    'A stoic detective haunted by a cold case.',    'Female', 'Main',  'chars/elara.jpg'),
('Dario Fen',     'Comic relief mechanic with a hidden past.',    'Male',   'Minor', 'chars/dario.jpg'),
('The Watcher',   'A mysterious figure seen in every scene.',     'Other',  'Minor', NULL),
('Commander Hale','Ruthless military leader, morally ambiguous.', 'Male',   'Main',  'chars/hale.jpg'),
('Yuki',          'A silent child who knows more than she lets on.','Female','Main', 'chars/yuki.jpg');


-- -------------------------------------------------------------
--  SEQUENTIAL ART
-- -------------------------------------------------------------
INSERT INTO sequential_art (title, type, added_by, note, status) VALUES
('Neon Requiem',      'Manga',   2, 'Cyberpunk noir set in 2087.',          'Published'),
('The Hollow Garden', 'Webtoon', 3, 'Psychological horror, slow burn.',     'Published'),
('Static Days',       'Comic',   2, 'Slice of life, ongoing series.',        'Draft'),
('Echoes of Red',     'Manga',   1, 'Action-heavy, admin curated.',          'Archived'),
('Unnamed Project',   'Other',   3, 'Still brainstorming.',                  'Pending');


-- -------------------------------------------------------------
--  SCRIPT
-- -------------------------------------------------------------
INSERT INTO script (title, body, runtime, genre, added_by, author_note, status) VALUES
('Last Signal',
 'FADE IN:\nEXT. ABANDONED STATION - NIGHT\nRain. A lone figure approaches...',
 'Short', 'Thriller', 2,
 'Inspired by a dream I had in 2022.',
 'Published'),

('The Longest Afternoon',
 'FADE IN:\nINT. COFFEE SHOP - DAY\nTwo strangers sit across from each other in silence...',
 'Flash', 'Drama', 3,
 'Experimental — no dialogue until page 8.',
 'Published'),

('Ironclad',
 'FADE IN:\nEXT. WARZONE - DAWN\nSmoke. Debris. Commander Hale steps over rubble...',
 'Long', 'Action', 2,
 'Sequel potential if this lands well.',
 'Draft'),

('Whisper Protocol',
 'FADE IN:\nINT. UNDERGROUND LAB - NIGHT\nYuki sits alone, staring at the screen...',
 'Medium', 'Sci-Fi', 3,
 NULL,
 'Pending'),

('Untitled Comedy',
 NULL,
 NULL, 'Comedy', 2,
 'Just an idea for now.',
 'Draft');


-- -------------------------------------------------------------
--  RECOMMENDED MUSIC
-- -------------------------------------------------------------
INSERT INTO recommended_music (link, target_type, targeted_id) VALUES
('https://open.spotify.com/track/abc111', 'SCRIPT', 1),   -- Last Signal
('https://open.spotify.com/track/abc222', 'SCRIPT', 1),   -- Last Signal (2nd track)
('https://open.spotify.com/track/abc333', 'ART',    1),   -- Neon Requiem
('https://youtu.be/xyz444',               'ART',    2),   -- The Hollow Garden
('https://open.spotify.com/track/abc555', 'SCRIPT', 3);   -- Ironclad


-- -------------------------------------------------------------
--  SCRIPT ↔ CHARACTER  (junction)
-- -------------------------------------------------------------
INSERT INTO script_character (script_id, character_id) VALUES
(1, 1),   -- Last Signal       → Elara Voss
(1, 3),   -- Last Signal       → The Watcher
(3, 4),   -- Ironclad          → Commander Hale
(4, 5),   -- Whisper Protocol  → Yuki
(4, 3),   -- Whisper Protocol  → The Watcher
(2, 2);   -- Longest Afternoon → Dario Fen


-- -------------------------------------------------------------
--  ART ↔ CHARACTER  (junction)
-- -------------------------------------------------------------
INSERT INTO art_character (art_id, character_id) VALUES
(1, 1),   -- Neon Requiem      → Elara Voss
(1, 2),   -- Neon Requiem      → Dario Fen
(2, 5),   -- Hollow Garden     → Yuki
(2, 3),   -- Hollow Garden     → The Watcher
(3, 2);   -- Static Days       → Dario Fen


-- -------------------------------------------------------------
--  FAVORITE ART
-- -------------------------------------------------------------
INSERT INTO favorite_art (user_id, art_id) VALUES
(2, 1),   -- kurosawa_jun  ♥ Neon Requiem
(2, 3),   -- kurosawa_jun  ♥ Static Days
(3, 2),   -- mika_tanaka   ♥ The Hollow Garden
(1, 1);   -- admin_rei     ♥ Neon Requiem


-- -------------------------------------------------------------
--  FAVORITE SCRIPT
-- -------------------------------------------------------------
INSERT INTO favorite_script (user_id, script_id) VALUES
(2, 1),   -- kurosawa_jun  ♥ Last Signal
(3, 1),   -- mika_tanaka   ♥ Last Signal
(3, 2),   -- mika_tanaka   ♥ The Longest Afternoon
(1, 3);   -- admin_rei     ♥ Ironclad


-- -------------------------------------------------------------
--  USER ACTIVITIES
-- -------------------------------------------------------------
INSERT INTO user_activities (user_id, activity_type, target_type, targeted_id, activity_description) VALUES
(2, 'Register',   NULL,       NULL, 'User registered via sign-up form.'),
(3, 'Register',   NULL,       NULL, 'User registered via sign-up form.'),
(2, 'Login',      NULL,       NULL, 'Logged in successfully.'),
(2, 'Create',     'SCRIPT',   1,    'Created script: Last Signal.'),
(3, 'Create',     'SCRIPT',   2,    'Created script: The Longest Afternoon.'),
(2, 'Create',     'ART',      1,    'Created art: Neon Requiem.'),
(3, 'Create',     'ART',      2,    'Created art: The Hollow Garden.'),
(2, 'Favorite',   'ART',      1,    'Added Neon Requiem to favorites.'),
(3, 'Favorite',   'SCRIPT',   1,    'Added Last Signal to favorites.'),
(2, 'Update',     'SCRIPT',   3,    'Updated script: Ironclad — changed status to Draft.'),
(1, 'Login',      NULL,       NULL, 'Admin logged in.'),
(3, 'Logout',     NULL,       NULL, 'User logged out.');