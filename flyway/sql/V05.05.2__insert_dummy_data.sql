-- Insert difficulty levels
INSERT INTO "difficulty_levels" ("difficulty_level_name")
VALUES ('Easy'),
    ('Medium'),
    ('Hard'),
    ('Extreme');
-- Insert users
INSERT INTO "users" ("google_id", "username")
VALUES ('oauth_001', 'alice'),
    ('oauth_002', 'bob'),
    ('oauth_003', 'carol'),
    ('oauth_004', 'dave'),
    ('oauth_005', 'eve'),
    ('oauth_006', 'frank'),
    ('oauth_007', 'grace'),
    ('oauth_008', 'heidi'),
    ('oauth_009', 'ivan'),
    ('oauth_010', 'judy');
-- Insert mazes (20 layouts)
INSERT INTO "mazes" (
        "maze_layout_url",
        "difficulty_level_id",
        "maze_level",
        "maze_size",
        "x_starting_position",
        "y_starting_position",
        "x_ending_position",
        "y_ending_position"
    )
VALUES (
        'https://maze-blob.s3.af-south-1.amazonaws.com/1.txt',
        1,
        1,
        6,
        0,
        0,
        9,
        9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/2.txt',
        2,
        2,
        7,
        1,
        1,
        9,
        9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/3.txt',
        3,
        3,
        8,
        2,
        2,
        9,
        9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/4.txt',
        1,
        4,
        9,
        0,
        1,
        9,
        9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/1.txt',
        1,
        1,
        5,
        1,
        1,
        1,
        3
    ),
(
        'https://maze-blob.s3.af-south-1.amazonaws.com/2.txt',
        1,
        2,
        8,
        6,
        1,
        1,
        6
    ),
(
        'https://maze-blob.s3.af-south-1.amazonaws.com/3.txt',
        1,
        3,
        10,
        0,
        1,
        8,
        8
    ),
(
        'https://maze-blob.s3.af-south-1.amazonaws.com/4.txt',
        1,
        4,
        12,
        1,
        10,
        10,
        1
    ),
(
        'https://maze-blob.s3.af-south-1.amazonaws.com/5.txt',
        2,
        5,
        10,
        1,
        0,
        9,
        9
    );
-- Insert completions
INSERT INTO "maze_completions" (
        "user_id",
        "maze_id",
        "time_taken_ms",
        "steps_taken"
    )
VALUES (1, 1, 30000, 34),
    (2, 2, 2000, 56),
    (3, 3, 1500, 89),
    (4, 4, 4000, 30),
    (5, 5, 7003, 70);