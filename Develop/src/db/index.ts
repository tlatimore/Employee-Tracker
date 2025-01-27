import { pool } from './connection.js';

export default class Db {
  constructor() {}

  async query(sql: string, args: any[] = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
}

//view departments
async viewDepartments() {
    const sql = "SELECT department.id, department.name FROM department;";
    return this.query(sql);
  }

//view roles
async viewRoles() {
    const sql = "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;";
    return this.query(sql);
  }

//view employees
async viewEmployees() {
    const sql =  "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    return this.query(sql);
  }

//add department
async addDepartment(department: string) {
    const sql = "INSERT INTO department (name) VALUES ($1);";
    return this.query(sql, [department]);
  }

//add role
async addRole(title: string, salary: number, department_id: number) {
    const sql = "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);";
    return this.query(sql, [title, salary, department_id]);
  }

//add employee
async addEmployee(first_name: string, last_name: string, role_id: number, manager_id: number) {
    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);";
    return this.query(sql, [first_name, last_name, role_id, manager_id]);
  }

//update employee role
async updateEmployeeRole(employee_id: number, role_id: number) {
    const sql = "UPDATE employee SET role_id = $1 WHERE id = $2;";
    return this.query(sql, [role_id, employee_id]);
  }

}
