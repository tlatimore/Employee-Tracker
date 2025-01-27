\c employeetracker_db

-- Insert sample data into departments table
INSERT INTO department (name) VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Marketing');

-- Insert sample data into roles table
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000, 1),
('Accountant', 60000, 2),
('HR Manager', 75000, 3),
('Marketing Specialist', 70000, 4);

-- Insert sample data into employees table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Emily', 'Jones', 3, NULL),
('Michael', 'Brown', 4, 3);