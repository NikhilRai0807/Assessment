# Product Requirements

## Overview

Build a minimal but usable salary management tool for an organization with
10,000 employees. The primary user is an HR manager who needs to maintain
employee records and quickly understand salary patterns across countries and job
titles.

## User Persona

### HR Manager

- Maintains employee records across departments and countries
- Reviews salary ranges to support hiring and compensation decisions
- Needs fast search and filtering for large employee datasets
- Needs trustworthy summary metrics without exporting data to spreadsheets

## Product Goals

- Make employee records easy to create, review, update, and remove
- Provide useful salary insights directly in the application
- Keep the interface responsive with 10,000 seeded employees
- Make the system easy for engineers to run, test, and extend

## Core Workflows

### Employee Management

1. View a paginated employee list
2. Search by employee name
3. Filter by country and job title
4. Sort by key columns such as name, country, job title, salary, and hire date
5. Add a new employee with validation feedback
6. Edit an existing employee
7. Delete an employee with confirmation

### Salary Insights

1. Review minimum, maximum, average, and median salary by country
2. Review average salary for a selected job title within a selected country
3. View employee count and total payroll cost
4. Identify top-paying job titles
5. Inspect a salary distribution chart

## Functional Requirements

### Employee Fields

- `id`
- `fullName`
- `jobTitle`
- `department`
- `country`
- `salary`
- `currency`
- `employmentType`
- `hireDate`
- `createdAt`
- `updatedAt`

### Employee Management Requirements

- Create, read, update, and delete employees through the UI
- Validate required fields and data types on backend and frontend
- Support case-insensitive search by full name
- Support filtering by country and job title
- Support pagination for large result sets
- Support deterministic sorting by supported columns

### Salary Insight Requirements

- Minimum salary by country
- Maximum salary by country
- Average salary by country
- Median salary by country
- Average salary for a job title in a country
- Employee count
- Total payroll cost
- Top-paying job titles
- Salary distribution dataset suitable for charting

## Non-Functional Requirements

- Tests must be deterministic, readable, and fast
- Aggregations must be executed in the database rather than in application memory
- Seed script must generate 10,000 employees deterministically
- Seed script must use batch inserts and transactions
- The application should handle common errors gracefully
- Code should stay readable and maintainable

## API Expectations

### Employee Endpoints

- `GET /employees`
- `POST /employees`
- `GET /employees/:id`
- `PATCH /employees/:id`
- `DELETE /employees/:id`

### Insight Endpoints

- `GET /insights/salary-by-country`
- `GET /insights/job-title-average`
- `GET /insights/summary`
- `GET /insights/top-paying-job-titles`
- `GET /insights/salary-distribution`

Final endpoint shapes may evolve slightly during TDD if a better contract
emerges, but the API should remain simple and predictable for the frontend.

## Out of Scope

- Authentication and authorization
- Role-based access control
- Historical salary changes
- CSV import/export
- Multi-currency normalization across exchange rates
- Audit logs
