CREATE TABLE maze_positions (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    maze_id integer NOT NULL,
    x_starting_position integer NOT NULL CHECK (x_starting_position >= 0),
    y_starting_position integer NOT NULL CHECK (y_starting_position >= 0),
    x_ending_position integer NOT NULL CHECK (x_ending_position >= 0),
    y_ending_position integer NOT NULL CHECK (y_ending_position >= 0)
);

ALTER TABLE maze_positions
    ADD FOREIGN KEY (maze_id) REFERENCES mazes (id) ON DELETE CASCADE;

INSERT INTO maze_positions (maze_id, x_starting_position, y_starting_position, x_ending_position, y_ending_position)
SELECT id, x_starting_position, y_starting_position, x_ending_position, y_ending_position
FROM mazes;

ALTER TABLE mazes
DROP COLUMN x_starting_position,
DROP COLUMN y_starting_position,
DROP COLUMN x_ending_position,
DROP COLUMN y_ending_position;