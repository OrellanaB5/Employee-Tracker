const inquirer = require('inquirer');
const dbPromise = require('./connection'); 

const viewDepartments = async () => {
    const db = await dbPromise;
    try {
        const [rows] = await db.query('SELECT * FROM departments');
        console.table(rows);
    } catch (err) {
        console.error('Error viewing departments:', err.message);
    }
};

const viewRoles = async () => {
    const db = await dbPromise;
    try {
        const [rows] = await db.query(`
            SELECT roles.id, roles.title, departments.name AS department, roles.salary 
            FROM roles 
            JOIN departments ON roles.department_id = departments.id
        `);
        console.table(rows);
    } catch (err) {
        console.error('Error viewing roles:', err.message);
    }
};

const viewEmployees = async () => {
    const db = await dbPromise;
    try {
        const [rows] = await db.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employees 
            LEFT JOIN roles ON employees.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id 
            LEFT JOIN employees manager ON employees.manager_id = manager.id
        `);
        console.table(rows);
    } catch (err) {
        console.error('Error viewing employees:', err.message);
    }
};

const addDepartment = async () => {
    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department you want to add?',
        validate: input => input ? true : 'Please enter a department name.'
    });

    const db = await dbPromise;
    try {
        await db.query('INSERT INTO departments (name) VALUES (?)', [departmentName]);
        console.log(`Added ${departmentName} to departments.`);
    } catch (err) {
        console.error('Error adding department:', err.message);
    }
};

const addRole = async () => {
    const db = await dbPromise;
    const [departments] = await db.query('SELECT * FROM departments');
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const answers = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'What is the title of the new role?', validate: input => !!input || 'Please enter a role title.' },
        { type: 'input', name: 'salary', message: 'What is the salary for this role?', validate: input => !isNaN(parseFloat(input)) || 'Please enter a valid salary.' },
        { type: 'list', name: 'departmentId', message: 'Which department does this role belong to?', choices: departmentChoices }
    ]);

    try {
        await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.departmentId]);
        console.log(`Added ${answers.title} to roles.`);
    } catch (err) {
        console.error('Error adding role:', err.message);
    }
};

const addEmployee = async () => {
    const db = await dbPromise;
    const [roles] = await db.query('SELECT * FROM roles');
    const roleChoices = roles.map(({ id, title }) => ({ name: title, value: id }));

    const [employees] = await db.query('SELECT * FROM employees');
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        { type: 'input', name: 'firstName', message: "What is the employee's first name?", validate: input => !!input || 'Please enter a first name.' },
        { type: 'input', name: 'lastName', message: "What is the employee's last name?", validate: input => !!input || 'Please enter a last name.' },
        { type: 'list', name: 'roleId', message: "What is the employee's role?", choices: roleChoices },
        { type: 'list', name: 'managerId', message: "Who is the employee's manager?", choices: managerChoices }
    ]);

    try {
        await db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.roleId, answers.managerId || null]);
        console.log(`Added ${answers.firstName} ${answers.lastName} to employees.`);
    } catch (err) {
        console.error('Error adding employee:', err.message);
    }
};

const updateEmployeeRole = async () => {
    const db = await dbPromise;
    const [employees] = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees');
    const employeeChoices = employees.map(({ id, name }) => ({ name, value: id }));

    const [roles] = await db.query('SELECT id, title FROM roles');
    const roleChoices = roles.map(({ id, title }) => ({ name: title, value: id }));

    const { employeeId, roleId } = await inquirer.prompt([
        { type: 'list', name: 'employeeId', message: "Which employee's role do you want to update?", choices: employeeChoices },
        { type: 'list', name: 'roleId', message: "What is the new role?", choices: roleChoices }
    ]);

    try {
        await db.query('UPDATE employees SET role_id = ? WHERE id = ?', [roleId, employeeId]);
        console.log("Employee's role updated successfully.");
    } catch (err) {
        console.error('Error updating employee role:', err.message);
    }
};

module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
