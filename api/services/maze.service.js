import * as repo from "../repositories/maze.repository.js";
import * as userService from "../services/user.service.js";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

export const listMazes = () => repo.getAllMazes();

export const getMaze = (id) => repo.getMazeById(id);

export const addMaze = (maze) => repo.addMaze(maze);

export const deleteMaze = (id) => repo.deleteMaze(id);

export const editMaze = async (maze) => {
  try {
    // Get the maze layout from the maze object (string of 1s and 0s)
    const mazeLayout = maze.maze_layout;
    
    // Convert the string of 1s and 0s to an actual binary buffer
    // Group bits into bytes (8 bits per byte)
    const binaryBuffer = Buffer.alloc(Math.ceil(mazeLayout.length / 8));
    
    for (let i = 0; i < mazeLayout.length; i++) {
      if (mazeLayout[i] === '1') {
        // Set the bit at the appropriate position in the byte
        const byteIndex = Math.floor(i / 8);
        const bitPosition = 7 - (i % 8); // MSB first
        binaryBuffer[byteIndex] |= (1 << bitPosition);
      }
    }
    
    // Generate a unique filename using UUID
    const fileName = `${uuidv4()}.bin`;
    
    // Configure S3 client
    const s3Client = new S3Client({
      region: "af-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    
    // Set up the upload parameters
    const uploadParams = {
      Bucket: "maze-blob",
      Key: fileName,
      Body: binaryBuffer,
      ContentType: "application/octet-stream"
    };
    
    // Upload the binary file to S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Set the maze layout URL to the S3 file location
    maze.maze_layout_url = `https://maze-blob.s3.af-south-1.amazonaws.com/${fileName}`;
    
    // Set difficulty level
    maze.difficulty_level_id = maze.difficulty_level_id || 1;
    
    // Save the maze with the updated URL
    return await repo.editMaze(maze);
  } catch (error) {
    console.error("Error uploading maze layout to S3:", error);
    throw new Error("Failed to upload maze layout to S3");
  }
};

export const completeMaze = (mazeId, playerGoogleId, timeTaken, stepsTaken) =>
  repo.postCompletion(mazeId, playerGoogleId, timeTaken, stepsTaken);

export const getMazeLeaderboard = (mazeId) => repo.getLeaderboard(mazeId);

export const getUserMazeCompletions = async (mazeId, userGoogleId) => {
  const user = await userService.getUserByGoogleId(userGoogleId);
  return repo.getUserMazeCompletions(mazeId, user?.id);
}
