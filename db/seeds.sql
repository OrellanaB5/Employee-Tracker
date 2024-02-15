INSERT INTO departments (name)
VALUES
    ('Product Development'),
    ('Human Resources'),
    ('Customer Support'),
    ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Product Manager', 95000, 1),
    ('Recruitment Specialist', 60000, 2),
    ('Support Technician', 45000, 3),
    ('Social Media Manager', 50000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Alex', 'Johnson', 1, NULL),
    ('Jamie', 'Smith', 2, 1),
    ('Jordan', 'Doe', 3, 1),
    ('Casey', 'Lee', 4, NULL);
