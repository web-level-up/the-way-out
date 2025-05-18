import * as repo from "../repositories/roles.repository.js";

export const getAllRoles = () => repo.getAllRoles();

export const getRoleByRoleName = (roleName) => repo.getRoleByRoleName(roleName);
