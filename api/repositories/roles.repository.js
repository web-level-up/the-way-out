import sql from "../config/db.js";

export const getAllRoles = () =>
  sql`SELECT * FROM roles`;

export const getRoleByRoleName = (roleName) =>
  sql`SELECT * FROM roles r WHERE r.role_name = ${roleName}`.then((rows) => rows[0]);

