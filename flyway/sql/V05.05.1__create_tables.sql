CREATE TABLE "users" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "google_id" varchar(50) NOT NULL UNIQUE,
    "username" varchar(50) NOT NULL UNIQUE
);
CREATE TABLE "mazes" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "maze_layout_url" varchar(255) NOT NULL,
    "difficulty_level_id" integer NOT NULL,
    "maze_level" integer NOT NULL UNIQUE,
    "maze_size" integer NOT NULL CHECK (maze_size > 0),
    "x_starting_position" integer NOT NULL CHECK (x_starting_position >= 0),
    "y_starting_position" integer NOT NULL CHECK (y_starting_position >= 0),
    "x_ending_position" integer NOT NULL CHECK (x_ending_position >= 0),
    "y_ending_position" integer NOT NULL CHECK (y_ending_position >= 0),
    CONSTRAINT check_x_starting_within_bounds CHECK (x_starting_position < maze_size),
    CONSTRAINT check_y_starting_within_bounds CHECK (y_starting_position < maze_size),
    CONSTRAINT check_x_ending_within_bounds CHECK (x_ending_position < maze_size),
    CONSTRAINT check_y_ending_within_bounds CHECK (y_ending_position < maze_size)
);
CREATE TABLE "difficulty_levels" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "difficulty_level_name" varchar(50) NOT NULL
);
CREATE TABLE "maze_completions" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "user_id" integer NOT NULL,
    "maze_id" integer NOT NULL,
    "time_taken_seconds" integer NOT NULL CHECK (time_taken_seconds >= 0),
    "steps_taken" integer NOT NULL CHECK (steps_taken >= 0)
);
ALTER TABLE "mazes"
ADD FOREIGN KEY ("difficulty_level_id") REFERENCES "difficulty_levels" ("id");
ALTER TABLE "maze_completions"
ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "maze_completions"
ADD FOREIGN KEY ("maze_id") REFERENCES "mazes" ("id") ON DELETE CASCADE;