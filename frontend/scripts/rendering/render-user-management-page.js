import { loadPage } from "./renderer.js";
import { getDataFromUrl, putReqToUrl } from "../util.js";
import { goBack, navigate } from "../router.js";
import { HttpError } from "../custom-errors.js";
import { renderErrorPage } from "./render-error.js";

const usersAndTheirRoles = {};

export function renderUserManagementPage() {
  return loadPage("views/user-management.html").then(() => {
    addNavbarEventListeners();
    getDataFromUrl("/api/user").then((usersWithRoles) => {
      getDataFromUrl("/api/roles").then((roles) => {
        renderUserRolesManagementTable(usersWithRoles, roles);
      });
    });
  });
}

function addNavbarEventListeners() {
  document
    .getElementById("home-button")
    .addEventListener("click", () => navigate("menu"));

  document
    .getElementById("back-button")
    .addEventListener("click", () => goBack());
}

function renderUserRolesManagementTable(userWithRoles, roles) {
  const userRoleManagementTableBody = document.getElementById(
    "user-role-management-table-body"
  );

  while (userRoleManagementTableBody.firstChild) {
    userRoleManagementTableBody.removeChild(
      userRoleManagementTableBody.firstChild
    );
  }

  userWithRoles.sort((a, b) => {
    const usernameA = a.username.toLowerCase();
    const usernameB = b.username.toLowerCase();
    if (usernameA < usernameB) {
      return -1;
    }
    if (usernameA > usernameB) {
      return 1;
    }
    return 0;
  });

  userWithRoles.forEach((user) => {
    usersAndTheirRoles[user.id] = {
      currentRoles: user.roles,
      rolesToAdd: [],
      rolesToRemove: [],
    };

    const row = userRoleManagementTableBody.insertRow();

    const usernameCell = row.insertCell();
    usernameCell.className = "username-cell";
    usernameCell.textContent = user.username;

    const rolesCell = row.insertCell();
    rolesCell.className = "roles-cell";

    const formElement = document.createElement("form");

    roles.map((role) => {
      const isChecked = user.roles.includes(role.role_name);

      const labelElement = document.createElement("label");
      labelElement.className = "role-checkbox";

      const inputElement = document.createElement("input");
      inputElement.type = "checkbox";
      inputElement.id = `${user.id}-${role.id}`;
      inputElement.name = "role";
      inputElement.value = role.role_name;
      inputElement.checked = isChecked;
      inputElement.disabled = role.role_name.toLowerCase() === "player";
      inputElement.addEventListener("change", (event) =>
        handleRoleChange(user.id, event.target, labelElement)
      );

      const roleTextNode = document.createTextNode(role.role_name);

      labelElement.appendChild(inputElement);
      labelElement.appendChild(roleTextNode);

      labelElement.style.backgroundColor = isChecked ? "#5e7143" : "#48494b";

      formElement.appendChild(labelElement);
    });

    rolesCell.appendChild(formElement);
  });
  document.getElementById("update-user-role-btn").addEventListener("click", () => {
    submitUserRolesChange();
  })
}

function handleRoleChange(userId, checkbox, labelElement) {
  const role = checkbox.value;

  if (checkbox.checked) {
    if (usersAndTheirRoles[userId].rolesToRemove.includes(role)) {
      usersAndTheirRoles[userId].rolesToRemove = usersAndTheirRoles[
        userId
      ].rolesToRemove.filter((item) => item !== role);
    } else if (!usersAndTheirRoles[userId].currentRoles.includes(role)) {
      usersAndTheirRoles[userId].rolesToAdd.push(role);
    }

    labelElement.style.backgroundColor = "#5e7143";

  } else {
    if (usersAndTheirRoles[userId].rolesToAdd.includes(role)) {
      usersAndTheirRoles[userId].rolesToAdd = usersAndTheirRoles[
        userId
      ].rolesToAdd.filter((item) => item !== role);
    } else if (usersAndTheirRoles[userId].currentRoles.includes(role)) {
      usersAndTheirRoles[userId].rolesToRemove.push(role);
    }

    labelElement.style.backgroundColor = "#48494b";
  }

  checkIfSubmitButtonShouldShow();
}

function checkIfSubmitButtonShouldShow() {
  const submitButton = document.getElementById("update-user-role-btn");
  const shouldShow = Object.values(usersAndTheirRoles).some(
    (item) => item.rolesToAdd.length > 0 || item.rolesToRemove.length > 0
  );
  submitButton.disabled = !shouldShow;
}

function submitUserRolesChange() {
  const usersToUpdate = Object.entries(usersAndTheirRoles)
    .filter(
      ([userId, roleData]) =>
        roleData.rolesToAdd.length > 0 || roleData.rolesToRemove.length > 0
    )
    .reduce((obj, [userId, roleData]) => {
      obj[userId] = roleData;
      return obj;
    }, {});

  putReqToUrl("/api/user/roles", usersToUpdate)
    .then((data) => {
      const feedback = document.getElementById("submission-feedback");
      feedback.textContent = "Successfully updated user roles";
      feedback.style.color = "green";
    })
    .catch((error) => {
      const feedback = document.getElementById("submission-feedback");
      feedback.textContent = "User roles were not updated:";
      feedback.style.color = "red";

      if (error instanceof HttpError) {
        if (error.status === 401) {
          renderErrorPage(
            "Your session has expired, you will need to login again",
            () => navigate(""),
            "Return to login"
          );
        } else {
          renderErrorPage(
            error.message ?? "An unexpected error has occurred",
            () => navigate("menu"),
            "Return to menu"
          );
        }
      } else {
        renderErrorPage(
          error ?? "An unexpected error has occurred",
          () => navigate("menu"),
          "Return to menu"
        );
      }
    });
}
