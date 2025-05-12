ALTER TABLE "difficulty_levels"
ADD COLUMN "preview_time" integer NOT NULL DEFAULT 45,
ADD COLUMN "escape_time" integer NOT NULL DEFAULT 90;

UPDATE "difficulty_levels"
SET "preview_time" = 60, "escape_time" = 120
WHERE "difficulty_level_name" = 'Easy';

UPDATE "difficulty_levels"
SET "preview_time" = 45, "escape_time" = 90
WHERE "difficulty_level_name" = 'Medium';

UPDATE "difficulty_levels"
SET "preview_time" = 30, "escape_time" = 60
WHERE "difficulty_level_name" = 'Hard';