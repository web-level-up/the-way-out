import * as rolesRepository from "../repositories/roles.repository.js";

export const getAllRoles = () => rolesRepository.getAllRoles();

export const getRoleByRoleName = (roleName) => rolesRepository.getRoleByRoleName(roleName);
