import { s3 } from "../config/aws.js";
import sql from "../config/db.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const getAllMazes = () =>
  sql`SELECT 
    m.id, 
    m.maze_level, 
    m.maze_size, 
    m.difficulty_level_id as difficulty_id, 
    d.difficulty_level_name as difficulty_name, 
    d.preview_time_seconds, 
    d.escape_time_seconds, 
    mp.x_starting_position, 
    mp.y_starting_position, 
    mp.x_ending_position, 
    mp.y_ending_position 
FROM mazes m 
    INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id
    INNER JOIN maze_positions mp ON m.id = mp.maze_id
ORDER BY m.id ASC`;

export const getMazeById = (id) =>
  sql`SELECT m.id, m.maze_level,
    m.maze_size, 
    m.maze_layout_url, 
    m.difficulty_level_id as difficulty_id, 
    d.difficulty_level_name as difficulty_name, 
    d.preview_time_seconds, d.escape_time_seconds, 
    mp.x_starting_position, 
    mp.y_starting_position, 
    mp.x_ending_position, 
    mp.y_ending_position 
    FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id 
    INNER JOIN maze_positions mp ON m.id = mp.maze_id
    WHERE m.id = ${id}`.then((rows) => rows[0]);

export const getMazeByMazeLevel = (mazeLevel) =>
  sql`SELECT m.id, m.maze_level,
    m.maze_size, 
    m.maze_layout_url, 
    m.difficulty_level_id as difficulty_id, 
    d.difficulty_level_name as difficulty_name, 
    d.preview_time_seconds, d.escape_time_seconds, 
    mp.x_starting_position, 
    mp.y_starting_position, 
    mp.x_ending_position, 
    mp.y_ending_position 
    FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id 
    INNER JOIN maze_positions mp ON m.id = mp.maze_id
    WHERE m.maze_level = ${mazeLevel}`.then((rows) => rows[0]);

export const addMaze = async ({
  mazeLayout,
  difficultyLevelId,
  mazeLevel,
  xStartingPosition,
  yStartingPosition,
  xEndingPosition,
  yEndingPosition,
}) => {
  return sql.begin(async (sqlTransaction) => {
    try {
      const s3Key = `${mazeLevel}.txt`;
      const s3Url = `https://maze-blob.s3.af-south-1.amazonaws.com/${s3Key}`;

      let mazeSize = Math.sqrt(
        mazeLayout
          .replaceAll("\r\n", "")
          .replaceAll("\n", "")
          .replaceAll(" ", "").length
      );

      // 2. Only if upload succeeds, insert into database with the real URL
      const result = await sqlTransaction`
        INSERT INTO mazes (
          maze_level, 
          maze_layout_url, 
          difficulty_level_id,
          maze_size
        ) 
        VALUES (
          ${mazeLevel}, 
          ${s3Url}, 
          ${difficultyLevelId},
          ${mazeSize}
        ) 
        RETURNING id
      `;

      const mazeId = result[0].id;
      await sqlTransaction`
        INSERT INTO maze_positions (
          maze_id,
          x_starting_position,
          y_starting_position,
          x_ending_position,
          y_ending_position
        ) VALUES (
          ${mazeId},
          ${xStartingPosition},
          ${yStartingPosition},
          ${xEndingPosition},
          ${yEndingPosition}
        )
      `;

      const command = new PutObjectCommand({
        Bucket: "maze-blob",
        Key: s3Key,
        Body: mazeLayout,
        ContentType: "text/plain",
      });

      await s3.send(command);

      return mazeId;
    } catch (error) {
      console.error("Error adding maze:", error);
      throw error;
    }
  });
};

export const editMaze = async ({
  id,
  mazeLayout,
  difficultyLevelId,
  mazeLevel,
  xStartingPosition,
  yStartingPosition,
  xEndingPosition,
  yEndingPosition,
}) => {
  return sql.begin(async (sqlTransaction) => {
    try {
      const s3Key = `${mazeLevel}.txt`;
      const s3Url = `https://maze-blob.s3.af-south-1.amazonaws.com/${s3Key}`;

      let mazeSize;
      if (mazeLayout) {
        mazeSize = Math.sqrt(
          mazeLayout
            .replaceAll("\r\n", "")
            .replaceAll("\n", "")
            .replaceAll(" ", "").length
        );
      }

      const result = await sqlTransaction`
        UPDATE mazes 
        SET maze_level = ${mazeLevel}, 
            maze_layout_url = ${s3Url}, 
            difficulty_level_id = ${difficultyLevelId}, 
            maze_size = ${mazeSize}
        WHERE id = ${id} 
        RETURNING id
      `;

      await sqlTransaction`
        UPDATE maze_positions
        SET 
          x_starting_position = ${xStartingPosition},
          y_starting_position = ${yStartingPosition},
          x_ending_position = ${xEndingPosition},
          y_ending_position = ${yEndingPosition}
        WHERE maze_id = ${id}
      `;

      if (mazeLayout) {
        const command = new PutObjectCommand({
          Bucket: "maze-blob",
          Key: s3Key,
          Body: mazeLayout,
          ContentType: "text/plain",
        });

        await s3.send(command);
      }

      return result[0].id;
    } catch (error) {
      console.error("Error editing maze:", error);
      throw error;
    }
  });
};

export const deleteMaze = (id) =>
  sql`DELETE FROM mazes WHERE id = ${id} RETURNING id`.then((rows) => {
    if (!rows || rows.length === 0) {
      const error = new Error(`Maze with ID ${id} not found`);
      error.name = "MazeNotFoundError";
      throw error;
    }
    return rows[0].id;
  });

export const postCompletion = (mazeId, playerGoogleId, timeTaken, stepsTaken) =>
  sql`WITH user_data AS (
        SELECT id FROM users WHERE google_id = ${playerGoogleId}
      )
      INSERT INTO maze_completions (maze_id, user_id, time_taken_seconds, steps_taken)
      VALUES (${mazeId}, (SELECT id FROM user_data LIMIT 1), ${timeTaken}, ${stepsTaken})
      RETURNING *`.then((rows) => rows[0]);

export const getLeaderboard = (mazeId) =>
  sql`
    SELECT u.username, first_completions.time_taken_seconds, first_completions.steps_taken
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
    ORDER BY first_completions.time_taken_seconds ASC
        LIMIT 10;
  `;
export const getUserMazeCompletions = (mazeId, userId) =>
  sql`
    SELECT u.username, mc.time_taken_seconds, mc.steps_taken
    FROM maze_completions mc
      INNER JOIN users u ON mc.user_id = u.id
    WHERE mc.maze_id = ${mazeId}
        AND mc.user_id = ${userId}
    ORDER BY mc.id ASC;
  `;
