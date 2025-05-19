import * as userRepository from "../repositories/user.repository.js";

export const listUsers = () => userRepository.getAllUsers();
export const getUser = (id) => userRepository.getUserById(id);
export const getUserByGoogleId = (googleId) => userRepository.getUserByGoogleId(googleId);

export const addUser = (googleId, username) => userRepository.addUser(googleId, username);

export const usernameTaken = (username) => userRepository.getUserByUsername(username);

export const getUsersRolesByUserId = (userId) => userRepository.getUsersRolesByUserId(userId);

export const addUserRole = (userId, roleId) => userRepository.addUserRole(userId, roleId);

export const removeUserRole = (userId, roleId) => userRepository.removeUserRole(userId, roleId);

export const doesUserHavePermissions = async (googleId, requiredRoleName) => {
  const currentUser = await getUserByGoogleId(googleId);

  const currentUserRoles = (await getUsersRolesByUserId(currentUser.id))
    .map(roles => roles.role_name) ;

  return currentUserRoles.includes(requiredRoleName);
}