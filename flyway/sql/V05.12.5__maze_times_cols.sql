ALTER TABLE "difficulty_levels"
ADD COLUMN "preview_time_seconds" integer NOT NULL DEFAULT 45,
ADD COLUMN "escape_time_seconds" integer NOT NULL DEFAULT 90;

UPDATE "difficulty_levels"
SET "preview_time_seconds" = 60, "escape_time_seconds" = 120
WHERE "difficulty_level_name" = 'Easy';

UPDATE "difficulty_levels"
SET "preview_time_seconds" = 45, "escape_time_seconds" = 90
WHERE "difficulty_level_name" = 'Medium';

UPDATE "difficulty_levels"
SET "preview_time_seconds" = 30, "escape_time_seconds" = 60
WHERE "difficulty_level_name" = 'Hard';