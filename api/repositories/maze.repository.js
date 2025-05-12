import sql from "../config/db.js";

export const getAllMazes = () =>
  sql`SELECT m.id, m.maze_layout, m.difficulty_level_id as difficulty_id, d.difficulty_level_name as difficulty_name, d.preview_time, d.escape_time, m.starting_position, m.ending_position FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id`;

export const getMazeById = (id) =>
  sql`SELECT m.id, m.maze_layout, m.difficulty_level_id as difficulty_id, d.difficulty_level_name as difficulty_name, d.preview_time, d.escape_time, m.starting_position, m.ending_position FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id WHERE m.id = ${id}`.then(
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
    SELECT u.username, mc.time_taken, mc.steps_taken
    FROM maze_completions mc
    INNER JOIN users u ON mc.user_id = u.id
    WHERE maze_id = ${mazeId}
    ORDER BY time_taken ASC
    LIMIT 10
  `;
