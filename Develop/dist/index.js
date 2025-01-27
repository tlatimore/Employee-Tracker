import inquirer from 'inquirer';
import Db from './db/index.js';
const db = new Db();
startApp();
function startApp() {
    mainMenu();
}
function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Departments',
                    value: 'viewDepartments',
                },
                {
                    name: 'View All Roles',
                    value: 'viewRoles',
                },
                {
                    name: 'View All Employees',
                    value: 'viewEmployees',
                },
                {
                    name: 'Add a Department',
                    value: 'addDepartment',
                },
                {
                    name: 'Add a Role',
                    value: 'addRole',
                },
                {
                    name: 'Add an Employee',
                    value: 'addEmployee',
                },
                {
                    name: 'Update Employee Role',
                    value: 'updateEmployeeRole',
                },
                {
                    name: 'Quit',
                    value: 'QUIT',
                },
            ],
        },
    ]).then((res) => {
        const choice = res.choice;
        switch (choice) {
            case 'viewDepartments':
                viewDepartments();
                break;
            case 'viewRoles':
                viewRoles();
                break;
            case 'viewEmployees':
                viewEmployees();
                break;
            case 'addDepartment':
                addDepartment();
                break;
            case 'addRole':
                addRole();
                break;
            case 'addEmployee':
                addEmployee();
                break;
            case 'updateEmployeeRole':
                updateEmployeeRole();
                break;
            case 'QUIT':
                quit();
                break;
        }
    });
}
// View all departments
function viewDepartments() {
    db.viewDepartments()
        .then(({ rows }) => {
        const departments = rows;
        console.log('\n');
        console.table(departments);
    })
        .then(() => mainMenu());
}
// View all roles
function viewRoles() {
    db.viewRoles()
        .then(({ rows }) => {
        const roles = rows;
        console.log('\n');
        console.table(roles);
    })
        .then(() => mainMenu());
}
// View all employees
function viewEmployees() {
    db.viewEmployees()
        .then(({ rows }) => {
        const employees = rows;
        console.log('\n');
        console.table(employees);
    })
        .then(() => mainMenu());
}
// Add a department
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        },
    ]).then((res) => {
        const department = res.department;
        db.addDepartment(department)
            .then(() => {
            console.log(`Added ${department} department to the database.`);
            mainMenu();
        });
    });
}
// Add a role
function addRole() {
    db.viewDepartments()
        .then(({ rows }) => {
        const departments = rows;
        const departmentChoices = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of this role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of this role?',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does this role belong in?',
                choices: departmentChoices,
            },
        ]).then((res) => {
            const { title, salary, department_id } = res;
            db.addRole(title, salary, department_id)
                .then(() => {
                console.log(`Added ${title} role to the database.`);
                mainMenu();
            });
        });
    });
}
// Add an employee
function addEmployee() {
    db.viewRoles()
        .then(({ rows }) => {
        const roles = rows;
        const roleChoices = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        return db.viewEmployees()
            .then(({ rows }) => {
            const employees = rows;
            const managerChoices = employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));
            managerChoices.unshift({ name: 'None', value: null });
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's role?",
                    choices: roleChoices,
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Who is the employee's manager?",
                    choices: managerChoices,
                },
            ]);
        });
    })
        .then((res) => {
        const { first_name, last_name, role_id, manager_id } = res;
        db.addEmployee(first_name, last_name, role_id, manager_id)
            .then(() => {
            console.log(`Added ${first_name} ${last_name} to the database.`);
            mainMenu();
        });
    });
}
// Update an employee's role
function updateEmployeeRole() {
    db.viewEmployees()
        .then(({ rows }) => {
        const employees = rows;
        const employeeChoices = employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        return db.viewRoles()
            .then(({ rows }) => {
            const roles = rows;
            const roleChoices = roles.map((role) => ({
                name: role.title,
                value: role.id,
            }));
            return inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: "Which employee's role would you like to update?",
                    choices: employeeChoices,
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's new role?",
                    choices: roleChoices,
                },
            ]);
        });
    })
        .then((res) => {
        const { employee_id, role_id } = res;
        db.updateEmployeeRole(employee_id, role_id)
            .then(() => {
            console.log(`Updated employee's role.`);
            mainMenu();
        });
    });
}
// Quit the application
function quit() {
    process.exit();
}
