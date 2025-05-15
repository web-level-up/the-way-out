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
VALUES
    (
     'https://maze-blob.s3.af-south-1.amazonaws.com/1.txt',
     1,
     1,
     5,
     1,
     1,
     1,
     3
    ),(
       'https://maze-blob.s3.af-south-1.amazonaws.com/2.txt',
       1,
       2,
       8,
       6,
       1,
       1,
       6
    ),(
       'https://maze-blob.s3.af-south-1.amazonaws.com/3.txt',
       1,
       3,
       10,
       0,
       1,
       8,
       8
    ),(
       'https://maze-blob.s3.af-south-1.amazonaws.com/4.txt',
       1,
       4,
       12,
       1,
       10,
       10,
       1
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/5.txt',
        1,
        5,
        15,
        0,
        1,
        3,
        13
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/6.txt',
        2,
        6,
        10,
        0,
        1,
        8,
        8
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/7.txt',
        2,
        7,
        12,
        10,
        1,
        9,
        10
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/8.txt',
        2,
        8,
        15,
        0,
        1,
        1,
        13
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/9.txt',
        2,
        9,
        18,
        1,
        1,
        16,
        16
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/10.txt',
        2,
        10,
        20,
        0,
        1,
        18,
        18
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/11.txt',
        3,
        11,
        15,
        8,
        1,
        1,
        14
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/12.txt',
        3,
        12,
        18,
        7,
        1,
        11,
        14
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/13.txt',
        3,
        13,
        20,
        13,
        1,
        7,
        7
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/14.txt',
        3,
        14,
        22,
        0,
        1,
        21,
        20
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/15.txt',
        3,
        15,
        24,
        1,
        1,
        15,
        1
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/16.txt',
        4,
        16,
        20,
        7,
        17,
        18,
        18
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/17.txt',
        4,
        17,
        21,
        19,
        1,
        5,
        19
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/18.txt',
        4,
        18,
        22,
        9,
        21,
        7,
        7
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/19.txt',
        4,
        19,
        23,
        9,
        21,
        7,
        21
    ),(
        'https://maze-blob.s3.af-south-1.amazonaws.com/20.txt',
        4,
        20,
        24,
        16,
        1,
        20,
        3
    );


                                                                                                                                                                                   -- Insert completions
INSERT INTO "maze_completions" (
        "user_id",
        "maze_id",
        "time_taken_seconds",
        "steps_taken"
    )
VALUES (1, 1, 130, 34),
    (2, 2, 210, 56),
    (3, 3, 300, 89),
    (4, 4, 110, 30),
    (5, 5, 250, 70),
    (6, 6, 620, 95),
    (7, 7,120, 40),
    (8, 8,220, 60),
    (9, 9, 290, 85),
    (10, 10, 150, 50),
    (1, 11, 180, 55),
    (2, 12, 270, 80),
    (3, 13, 135, 42),
    (4, 14, 230, 65),
    (5, 15, 610, 90),
    (6, 16, 140, 45),
    (7, 17, 200, 60),
    (8, 18, 280, 88),
    (9, 19, 165, 48),
    (10, 20, 190, 58);
