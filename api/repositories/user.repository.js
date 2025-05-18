import sql from "../config/db.js";

export const getAllUsers = () =>
  sql`
    SELECT
      u.id,
      u.google_id,
      u.username,
      ARRAY_AGG(r.role_name) AS roles
    FROM users u
     LEFT JOIN user_roles ur ON u.id = ur.user_id
     LEFT JOIN roles r ON ur.role_id = r.id
    GROUP BY u.id, u.google_id, u.username;`;

export const getUserById = (id) =>
  sql`
    SELECT
      u.id,
      u.google_id,
      u.username,
      ARRAY_AGG(r.role_name) AS roles
    FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = ${id}
    GROUP BY u.id, u.google_id, u.username;
    `.then((rows) => rows[0]);

export const getUserByGoogleId = (googleId) =>
  sql`
    SELECT
      u.id,
      u.google_id,
      u.username,
      ARRAY_AGG(r.role_name) AS roles
    FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.google_id = ${googleId}
    GROUP BY u.id, u.google_id, u.username;
    `.then((rows) => rows[0]
  );

export const addUser = (google_id, username) =>
  sql`INSERT INTO users (google_id, username)
      VALUES (${google_id}, ${username})
      RETURNING *`.then((rows) => rows[0]);

export const getUserByUsername = (username) =>
  sql`SELECT * FROM users u WHERE u.username = ${username}`.then(
    (rows) => rows[0]
  );

export const getUsersRolesByUserId = (userId) =>
  sql`SELECT role_name 
    FROM user_roles ur
     INNER JOIN roles r ON ur.role_id = r.id
    WHERE user_id = ${userId}`;

export const addUserRole = (userId, roleId) =>
  sql`INSERT INTO user_roles (user_id, role_id)
    VALUES (${userId}, ${roleId})
    RETURNING *`.then((rows) => rows[0]);

export const removeUserRole = (userId, roleId) =>
  sql`DELETE FROM user_roles
    WHERE user_id = ${userId} AND role_id = ${roleId};`;