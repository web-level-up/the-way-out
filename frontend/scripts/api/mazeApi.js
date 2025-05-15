// frontend/scripts/api/mazeApi.js

export async function fetchMazeById(mazeId) {
  const response = await fetch(`http://localhost:3000/api/mazes/${mazeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add Authorization header if needed
      // 'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Maze not found or server error");
  }
  return response.json();
}
