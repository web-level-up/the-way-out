import sql from "../config/db.js";

export const getAllMazes = () =>
  sql`SELECT m.id, m.maze_level, m.maze_size, m.difficulty_level_id as difficulty_id, d.difficulty_level_name as difficulty_name, d.preview_time_seconds, d.escape_time_seconds, m.x_starting_position, m.y_starting_position, m.x_ending_position, m.y_ending_position FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id ORDER BY m.id ASC`;

export const getMazeById = (id) =>
  sql`SELECT m.id, m.maze_level, m.maze_size, m.maze_layout_url as mazeLayoutUrl, m.difficulty_level_id as difficulty_id, d.difficulty_level_name as difficulty_name, d.preview_time_seconds, d.escape_time_seconds, m.x_starting_position, m.y_starting_position, m.x_ending_position, m.y_ending_position FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id WHERE m.id = ${id}`.then(
    (rows) => rows[0]
  );

export const postCompletion = (mazeId, playerGoogleId, timeTaken, stepsTaken) =>
  sql`WITH user_data AS (
        SELECT id FROM users WHERE google_id = ${playerGoogleId}
      )
      INSERT INTO maze_completions (maze_id, user_id, time_taken, steps_taken)
      VALUES (${mazeId}, (SELECT id FROM user_data LIMIT 1), ${timeTaken}, ${stepsTaken})
      RETURNING *`.then((rows) => rows[0]);

export const getLeaderboard = (mazeId) =>
  sql`
    SELECT u.username, first_completions.time_taken, first_completions.steps_taken
    FROM (
      SELECT mc_inner.*
      FROM maze_completions mc_inner
      WHERE mc_inner.maze_id = ${mazeId}
        AND NOT EXISTS (
          SELECT 1
          FROM maze_completions mc_older
          WHERE mc_older.user_id = mc_inner.user_id
            AND mc_older.maze_id = mc_inner.maze_id
            AND mc_older.id < mc_inner.id
        )
    ) AS first_completions
      INNER JOIN users u ON first_completions.user_id = u.id
    ORDER BY first_completions.time_taken ASC
        LIMIT 10;
  `;
export const getUserMazeCompletions = (mazeId, userId) =>
  sql`
    SELECT u.username, mc.time_taken, mc.steps_taken
    FROM maze_completions mc
      INNER JOIN users u ON mc.user_id = u.id
    WHERE mc.maze_id = ${mazeId}
        AND mc.user_id = ${userId}
    ORDER BY mc.id ASC;
  `;
