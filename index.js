const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./db/queries');

const promptUser = async () => {
  let answer;
  try {
    answer = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Quit'
      ],
    });

    switch (answer.action) {
      case 'View All Departments':
        await viewDepartments();
        break;
      case 'View All Roles':
        await viewRoles();
        break;
      case 'View All Employees':
        await viewEmployees();
        break;
      case 'Add a Department':
        await addDepartment();
        break;
      case 'Add a Role':
        await addRole();
        break;
      case 'Add an Employee':
        await addEmployee();
        break;
      case 'Update an Employee Role':
        await updateEmployeeRole();
        break;
      case 'Quit':
        console.log('Exiting application.');
        return; // Early return to prevent re-prompting
    }
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    if (answer && answer.action !== 'Quit') {
      promptUser();
    }
  }
};


const db = require('./db/connection');

const startApplication = async () => {
  try {
    await db;
    console.log('Connected to the database.');
    promptUser();
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
};

startApplication();