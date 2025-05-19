import express from "express";
import * as userService from "../services/user.service.js";
import * as rolesService from "../services/roles.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!(await userService.doesUserHavePermissions(req.user.sub, "User Manager"))) {
      return res.status(403).json({ error: "You do not have permission to get all users." });
    }

    const users = await userService.listUsers();
    res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch users. Try again later." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!(await userService.doesUserHavePermissions(req.user.sub, "User Manager"))) {
      return res.status(403).json({ error: "You do not have permission to get user." });
    }

    const user = await userService.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to fetch user. Try again later." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    } else if (username.length > 50) {
      return res
        .status(400)
        .json({ error: "Username cant be longer than 50 characters" });
    }
    const user = await userService.usernameTaken(username);
    if (user) return res.status(400).json({ error: "Username taken" });

    const createdUser = await userService.addUser(req.user.sub, username);

    const role = await rolesService.getRoleByRoleName("Player")

    if (!(await userService.addUserRole(createdUser.id, role.id))) {
      return res.status(500).json({ error: "Error occurred when trying to add user role." });
    }

    const userRoles = await userService.getUsersRolesByUserId(createdUser.id);
    res.json({createdUser: createdUser, roles: userRoles.map(role => role.role_name)});
  } catch (error) {
    return res.status(500).json({ error: "Unable to create user." });
  }
});

router.put("/roles", async (req, res) => {
  try {
    if (!(await userService.doesUserHavePermissions(req.user.sub, "User Manager"))) {
      return res.status(403).json({ error: "You do not have permission to update user roles." });
    }

    const usersToUpdate = req.body;

    const allRoles = await rolesService.getAllRoles();

    for (const userId in usersToUpdate) {
      for (const index in usersToUpdate[userId].rolesToAdd) {
        const roleName = usersToUpdate[userId].rolesToAdd[index];
        const roleId = allRoles.find(role => role.role_name === roleName)?.id;

        if (!roleId) {
          return res.status(500).json({ error: `Role ${roleName} not found. Unable to add role to user.` });
        }

        await userService.addUserRole(userId, roleId);
      }

      for (const index in usersToUpdate[userId].rolesToRemove) {
        const roleName = usersToUpdate[userId].rolesToRemove[index];
        const roleId = allRoles.find(role => role.role_name === roleName)?.id;

        if (!roleId) {
          return res.status(500).json({ error: `Role ${roleName} not found. Unable to remove role from user.` });
        }

        await userService.removeUserRole(userId, roleId);
      }
    }

    res.status(201).json(true);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Unable to update user roles. Try again later." });
  }
});

export default router;
