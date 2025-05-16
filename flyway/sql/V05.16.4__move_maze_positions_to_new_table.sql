CREATE TABLE maze_positions (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    maze_id integer NOT NULL,
    x integer NOT NULL CHECK (x >= 0),
    y integer NOT NULL CHECK (y >= 0),
    is_starting_position boolean
);

ALTER TABLE maze_positions
    ADD FOREIGN KEY (maze_id) REFERENCES mazes (id) ON DELETE CASCADE;

INSERT INTO maze_positions (maze_id, x, y, is_starting_position)
SELECT id, x_starting_position, y_starting_position, TRUE
FROM mazes;

INSERT INTO maze_positions (maze_id, x, y, is_starting_position)
SELECT id, x_ending_position, y_ending_position, FALSE
FROM mazes;

ALTER TABLE mazes
DROP COLUMN x_starting_position,
DROP COLUMN y_starting_position,
DROP COLUMN x_ending_position,
DROP COLUMN y_ending_position;