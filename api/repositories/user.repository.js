import sql from "../config/db.js";

export const getAllUsers = () => sql`SELECT * FROM users`;

export const getUserById = (id) =>
  sql`SELECT * FROM users u WHERE u.id = ${id}`.then((rows) => rows[0]);

export const getUserByGoogleId = (googleId) =>
  sql`SELECT * FROM users u WHERE u.google_id = ${googleId}`.then(
    (rows) => rows[0]
  );

export const addUser = (google_id, username) =>
  sql`INSERT INTO users (google_id, username)
      VALUES (${google_id}, ${username})
      RETURNING *`.then((rows) => rows[0]);

export const getUserByUsername = (username) =>
  sql`SELECT * FROM users u WHERE u.username = ${username}`.then(
    (rows) => rows[0]
  );
