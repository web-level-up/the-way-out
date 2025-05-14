-- Insert difficulty levels
INSERT INTO "difficulty_levels" ("difficulty_level_name")
VALUES ('Easy'),
    ('Medium'),
    ('Hard');
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
-- Insert mazes (25 layouts)
INSERT INTO "mazes" (
        "maze_layout_url",
        "difficulty_level_id",
        "maze_level",
        "x_starting_position",
        "y_starting_position",
        "x_ending_position",
        "y_ending_position"
    )
VALUES (
        'https://maze-blob.s3.af-south-1.amazonaws.com/1.txt',
        1,
        1,
        0, 0,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/2.txt',
        2,
        2,
        1, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/3.txt',
        3,
        3,
        2, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/4.txt',
        1,
        4,
        0, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/5.txt',
        2,
        5,
        1, 0,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/6.txt',
        3,
        6,
        0, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/7.txt',
        1,
        7,
        2, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/8.txt',
        2,
        8,
        0, 3,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/9.txt',
        3,
        9,
        3, 0,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/10.txt',
        1,
        10,
        1, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/11.txt',
        2,
        11,
        2, 0,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/12.txt',
        3,
        12,
        3, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/13.txt',
        1,
        13,
        1, 3,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/14.txt',
        2,
        14,
        3, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/15.txt',
        3,
        15,
        0, 0,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/16.txt',
        1,
        16,
        2, 3,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/17.txt',
        2,
        17,
        0, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/18.txt',
        3,
        18,
        1, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/19.txt',
        1,
        19,
        3, 3,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/20.txt',
        2,
        20,
        2, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/21.txt',
        3,
        21,
        1, 0,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/22.txt',
        1,
        22,
        3, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/23.txt',
        2,
        23,
        1, 2,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/24.txt',
        3,
        24,
        2, 1,
        9, 9
    ),
    (
        'https://maze-blob.s3.af-south-1.amazonaws.com/25.txt',
        1,
        25,
        0, 1,
        9, 9
    );
-- Insert completions
INSERT INTO "maze_completions" (
        "user_id",
        "maze_id",
        "time_taken",
        "steps_taken"
    )
VALUES (1, 1, INTERVAL '00:02:10', 34),
    (2, 2, INTERVAL '00:03:30', 56),
    (3, 3, INTERVAL '00:05:00', 89),
    (4, 4, INTERVAL '00:01:50', 30),
    (5, 5, INTERVAL '00:04:10', 70),
    (6, 6, INTERVAL '00:05:20', 95),
    (7, 7, INTERVAL '00:02:00', 40),
    (8, 8, INTERVAL '00:03:40', 60),
    (9, 9, INTERVAL '00:04:50', 85),
    (10, 10, INTERVAL '00:02:30', 50),
    (1, 11, INTERVAL '00:03:00', 55),
    (2, 12, INTERVAL '00:04:30', 80),
    (3, 13, INTERVAL '00:02:15', 42),
    (4, 14, INTERVAL '00:03:50', 65),
    (5, 15, INTERVAL '00:05:10', 90),
    (6, 16, INTERVAL '00:02:20', 45),
    (7, 17, INTERVAL '00:03:20', 60),
    (8, 18, INTERVAL '00:04:40', 88),
    (9, 19, INTERVAL '00:02:45', 48),
    (10, 20, INTERVAL '00:03:10', 58),
    (1, 21, INTERVAL '00:05:25', 99),
    (2, 22, INTERVAL '00:02:05', 36),
    (3, 23, INTERVAL '00:04:00', 70),
    (4, 24, INTERVAL '00:05:00', 94),
    (5, 25, INTERVAL '00:02:55', 52);