CREATE TABLE "users" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "google_id" varchar NOT NULL UNIQUE,
    "username" varchar NOT NULL UNIQUE
);
CREATE TABLE "mazes" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "maze_layout_url" varchar NOT NULL,
    "difficulty_level_id" integer NOT NULL,
    "starting_position" INTEGER [2] DEFAULT '{0,0}'
);
CREATE TABLE "difficulty_levels" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    "difficulty_level_name" varchar NOT NULL
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