CREATE TABLE roles (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    role_name varchar(50) NOT NULL
);

CREATE TABLE user_roles (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL
);

ALTER TABLE user_roles
    ADD FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
ALTER TABLE user_roles
    ADD FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE;

INSERT INTO roles (role_name)
VALUES ('Maze Manager'),
       ('Player');