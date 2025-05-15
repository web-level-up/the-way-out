import { s3 } from "../config/aws.js";
import sql from "../config/db.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const getAllMazes = () =>
  sql`SELECT m.id, m.maze_level, m.maze_size, m.difficulty_level_id as difficulty_id, d.difficulty_level_name as difficulty_name, d.preview_time_seconds, d.escape_time_seconds, m.x_starting_position, m.y_starting_position, m.x_ending_position, m.y_ending_position FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id ORDER BY m.id ASC`;

export const getMazeById = (id) =>
  sql`SELECT m.id, m.maze_level, m.maze_size, m.maze_layout_url, m.difficulty_level_id as difficulty_id, d.difficulty_level_name as difficulty_name, d.preview_time_seconds, d.escape_time_seconds, m.x_starting_position, m.y_starting_position, m.x_ending_position, m.y_ending_position FROM mazes m INNER JOIN difficulty_levels d ON m.difficulty_level_id = d.id WHERE m.id = ${id}`.then(
    (rows) => rows[0]
  );

export const addMaze = async (maze) => {
  return sql.begin(async (sqlTransaction) => {
    try {
      const s3Key = `${maze.maze_level}.txt`;
      const s3Url = `https://maze-blob.s3.af-south-1.amazonaws.com/${s3Key}`;

      maze.maze_size = Math.sqrt(maze.maze_layout.length);
      maze.difficulty_level_id = maze.difficulty_id;

      // 2. Only if upload succeeds, insert into database with the real URL
      const result = await sqlTransaction`
        INSERT INTO mazes (
          maze_level, 
          maze_layout_url, 
          difficulty_level_id,
          maze_size, 
          x_starting_position, 
          y_starting_position, 
          x_ending_position, 
          y_ending_position
        ) 
        VALUES (
          ${maze.maze_level}, 
          ${s3Url}, 
          ${maze.difficulty_level_id},
          ${maze.maze_size || null}, 
          ${maze.x_starting_position}, 
          ${maze.y_starting_position}, 
          ${maze.x_ending_position}, 
          ${maze.y_ending_position}
        ) 
        RETURNING id
      `;

      // Replace with your actual S3 upload function
      const command = new PutObjectCommand({
        Bucket: "maze-blob",
        Key: s3Key,
        Body: maze.maze_layout,
        ContentType: "text/plain",
      });
      s3.send(command, (err, data) => {
        if (err) {
          console.error("Error uploading to S3:", err);
          throw new Error("S3 upload failed");
        }
      });

      return result[0].id;
    } catch (error) {
      // Any error (S3 upload or DB insert) will roll back the transaction
      console.error("Error adding maze:", error);
      throw error;
    }
  });
};

export const editMaze = async (maze) => {
  return sql.begin(async (sqlTransaction) => {
    try {
      const s3Key = `${maze.maze_level}.txt`;
      const s3Url = `https://maze-blob.s3.af-south-1.amazonaws.com/${s3Key}`;

      // If maze_layout is provided, recalculate the maze_size
      if (maze.maze_layout) {
        maze.maze_size = Math.sqrt(maze.maze_layout.length);
      }

      maze.difficulty_level_id = maze.difficulty_id;

      // Update the database record
      const result = await sqlTransaction`
        UPDATE mazes 
        SET maze_level = ${maze.maze_level}, 
            maze_layout_url = ${s3Url}, 
            difficulty_level_id = ${maze.difficulty_level_id}, 
            maze_size = ${maze.maze_size},
            x_starting_position = ${maze.x_starting_position}, 
            y_starting_position = ${maze.y_starting_position}, 
            x_ending_position = ${maze.x_ending_position}, 
            y_ending_position = ${maze.y_ending_position} 
        WHERE id = ${maze.id} 
        RETURNING id
      `;

      // Only upload to S3 if a new maze_layout is provided
      if (maze.maze_layout) {
        const command = new PutObjectCommand({
          Bucket: "maze-blob",
          Key: s3Key,
          Body: maze.maze_layout,
          ContentType: "text/plain",
        });

        s3.send(command, (err, data) => {
          if (err) {
            console.error("Error uploading to S3:", err);
            throw new Error("S3 upload failed");
          }
        });
      }

      return result[0].id;
    } catch (error) {
      console.error("Error editing maze:", error);
      throw error;
    }
  });
};

export const deleteMaze = (id) =>
  sql`DELETE FROM mazes WHERE id = ${id} RETURNING id`.then(
    (rows) => rows[0].id
  );

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
