CREATE TABLE "users" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "google_id" varchar(50) NOT NULL UNIQUE,
    "username" varchar(50) NOT NULL UNIQUE
);
CREATE TABLE "mazes" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "maze_layout_url" varchar(50) NOT NULL,
    "difficulty_level_id" integer NOT NULL,
    "x_starting_position" integer NOT NULL,
    "y_starting_position" integer NOT NULL,
    "x_ending_position" integer NOT NULL,
    "y_ending_position" integer NOT NULL,
);
CREATE TABLE "difficulty_levels" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "difficulty_level_name" varchar(50) NOT NULL
);
CREATE TABLE "maze_completions" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "user_id" integer NOT NULL,
    "maze_id" integer NOT NULL,
    "time_taken" interval NOT NULL,
    "steps_taken" integer NOT NULL
);
ALTER TABLE "mazes"
ADD FOREIGN KEY ("difficulty_level_id") REFERENCES "difficulty_levels" ("id");
ALTER TABLE "maze_completions"
ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "maze_completions"
ADD FOREIGN KEY ("maze_id") REFERENCES "mazes" ("id");