# Salary Management Assessment

A minimal but usable salary management tool for an HR manager responsible for
an organization with 10,000 employees.

## What This Includes

- Employee management UI for add, view, update, delete, search, filter,
  sorting, and pagination
- Salary insights UI for country-level metrics and salary distribution
- Express + TypeScript backend with Prisma and SQLite
- Next.js + TypeScript frontend with Material UI and Recharts
- Deterministic seed script for 10,000 employees
- Automated tests across backend and frontend
- Product, architecture, tradeoff, and AI usage notes in `docs/`

## Tech Stack

- Backend: Node.js, Express, TypeScript
- ORM: Prisma
- Database: SQLite
- Frontend: Next.js, React, TypeScript
- UI: Material UI
- Charts: Recharts
- Tests: Jest, Supertest, React Testing Library

## Repository Structure

- `apps/api`: backend API, Prisma schema, seed script, backend tests
- `apps/web`: frontend app and frontend tests
- `docs`: product requirements, architecture, tradeoffs, AI usage log

### Frontend Structure

- `apps/web/src/app`: Next.js app entrypoints and layout
- `apps/web/src/components/employees`: employee table and employee form
- `apps/web/src/components/insights`: salary cards, chart, and top-paying list
- `apps/web/src/components/salary-management`: page composition and client state
- `apps/web/src/lib`: API client, formatting helpers, and shared types

### Backend Structure

- `apps/api/src/app`: Express app setup and middleware
- `apps/api/src/features/employees`: employee routes, validation, and service logic
- `apps/api/src/features/insights`: insight routes, validation, and aggregation logic
- `apps/api/src/lib`: Prisma client and database bootstrap helpers
- `apps/api/src/seed`: deterministic seed generator and seeding command

## Local Setup

### Prerequisites

- Node.js 22+ or newer
- npm 10+

### Environment

From the repository root:

```powershell
Copy-Item .env.example .env
```

Default values:

- `DATABASE_URL="file:./dev.db"`
- `NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"`

Note:
The API runtime falls back to a temp-directory SQLite database in this Windows
workspace when needed to avoid local path issues with SQLite/Prisma in nested
OneDrive directories.

### Install Dependencies

```powershell
npm install
```

## Running The App

Use two terminals from the repository root.

### Terminal 1: Backend

```powershell
npm --workspace apps/api run dev
```

The API runs on `http://localhost:4000`.

### Terminal 2: Frontend

```powershell
npm --workspace apps/web run dev
```

The web app runs on `http://localhost:3000`.

### Current Runtime Behavior

- Employee create, update, and delete actions are sent to the backend API
- The salary insights dashboard loads live data from the backend API on page load
- Changing the country filter refreshes the salary summary and distribution chart
- Top-paying job titles are refreshed from the API after employee mutations
- The page still boots with local fallback props so the UI can render before live data arrives

## Test Instructions

### Run Everything

```powershell
npm run lint
npm run typecheck
npm run test
```

### Run Backend Only

```powershell
npm --workspace apps/api run lint
npm --workspace apps/api run typecheck
npm --workspace apps/api run test
```

### Run Frontend Only

```powershell
npm --workspace apps/web run lint
npm --workspace apps/web run typecheck
npm --workspace apps/web run test
```

## Seed Instructions

Generate 10,000 deterministic employees:

```powershell
npm --workspace apps/api run seed
```

Expected output:

```text
Seeded 10000 employees in 20 batches.
```

Seed source files:

- `apps/api/prisma/data/first_names.txt`
- `apps/api/prisma/data/last_names.txt`

## API Overview

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

## API Examples

### Create Employee

```http
POST /employees
Content-Type: application/json

{
  "fullName": "Ava Thompson",
  "jobTitle": "Software Engineer",
  "department": "Engineering",
  "country": "India",
  "salary": 185000,
  "currency": "INR",
  "employmentType": "FULL_TIME",
  "hireDate": "2024-01-15"
}
```

### List Employees With Filters

```http
GET /employees?page=1&pageSize=10&search=ava&country=India&jobTitle=Software%20Engineer&sortBy=salary&sortOrder=desc
```

### Salary By Country

```http
GET /insights/salary-by-country?country=India
```

Example response:

```json
{
  "country": "India",
  "employeeCount": 2,
  "minSalary": 125000,
  "maxSalary": 185000,
  "averageSalary": 155000,
  "medianSalary": 155000,
  "totalPayroll": 310000
}
```

### Job Title Average In Country

```http
GET /insights/job-title-average?country=India&jobTitle=Software%20Engineer
```

## Product Notes

- Primary persona: HR Manager
- Main workflow: maintain employee records and inspect compensation trends
- Dataset target: 10,000 seeded employees
- Insights are database-backed and do not load all employees into memory

See:

- `docs/product-requirements.md`
- `docs/architecture.md`
- `docs/tradeoffs.md`
- `docs/ai-usage-log.md`

## Deployment Notes

### Current Shape

- Frontend can be deployed as a Next.js app
- Backend can be deployed as a Node.js service
- SQLite is suitable for local/demo deployment

### Practical Deployment Recommendation

For a take-home/demo environment:

1. Deploy the API as a small Node service
2. Deploy the Next.js app separately
3. Point `NEXT_PUBLIC_API_BASE_URL` to the deployed API
4. Seed the API environment once before demoing

### Production Caveat

For a production-scale multi-user environment, SQLite would likely be replaced
with PostgreSQL or another server database.

## Performance Notes

- Employee listing uses pagination at the data layer
- Filtering and sorting are handled in the backend
- Salary insights use Prisma aggregates and targeted SQL for median/distribution
- The seed script uses deterministic generation and batched inserts in a
  transaction
- Verified seed result: 10,000 employees inserted in 20 batches

## Known Tradeoffs

- SQLite keeps setup simple but is not the right long-term production database
- Prisma schema-engine operations were unreliable in this Windows/OneDrive
  workspace, so the checked-in migration SQL is paired with a runtime schema
  bootstrap for local resilience
- The frontend still uses bootstrap fallback props for its first paint; the
  insights dashboard then refreshes from the backend API when remote sync is enabled
- Employee listing, filtering, and pagination are currently handled client-side
  in the page component instead of fully hydrating from the backend query API
- Authentication, audit trails, and salary-history tracking are intentionally
  out of scope

## Documentation Artifacts

- Product requirements: `docs/product-requirements.md`
- Architecture decisions: `docs/architecture.md`
- Tradeoffs: `docs/tradeoffs.md`
- AI usage log: `docs/ai-usage-log.md`
