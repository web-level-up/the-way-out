import * as repo from "../repositories/user.repository.js";

export const listUsers = () => repo.getAllUsers();
export const getUser = (id) => repo.getUserById(id);
export const getUserByGoogleId = (googleId) => repo.getUserByGoogleId(googleId);

export const addUser = (googleId, username) => repo.addUser(googleId, username);

export const usernameTaken = (username) => repo.getUserByUsername(username);

export const getUsersRolesByUserId = (userId) => repo.getUsersRolesByUserId(userId);

export const addUserRole = (userId, roleId) => repo.addUserRole(userId, roleId);

export const removeUserRole = (userId, roleId) => repo.removeUserRole(userId, roleId);