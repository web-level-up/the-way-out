INSERT INTO user_roles (user_id, role_id)
SELECT id, 1
FROM users;