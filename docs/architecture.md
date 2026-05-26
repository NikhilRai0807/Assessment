# Architecture Decisions

## System Overview

The application is a small monorepo with separate frontend and backend apps.

- `apps/api`: Express API with TypeScript and Prisma
- `apps/web`: Next.js frontend with TypeScript and Material UI
- `docs`: product, architecture, tradeoffs, and AI usage notes

This split keeps concerns clear while avoiding unnecessary complexity for the
assessment.

## Architectural Style

The backend will follow a lightweight clean architecture approach.

- `domain`: core entities and business rules
- `application`: use cases and orchestration
- `infrastructure`: Prisma repositories and external adapters
- `presentation`: Express route handlers and request validation

The frontend will follow a feature-oriented structure.

- `app`: routing and page composition
- `components`: reusable UI pieces
- `lib`: API clients, formatters, and shared helpers

## Backend Design

### API Design

The API will be REST-oriented because the assessment focuses on predictable CRUD
and reporting workflows.

Planned response characteristics:

- Stable pagination metadata for list endpoints
- Explicit query parameters for search, filter, and sorting
- Consistent validation error format
- Clear 404 responses for missing employees

### Validation

`zod` will be used at the request boundary for payload and query validation.
This keeps route handlers thin and ensures invalid data does not leak into
domain or persistence layers.

### Persistence

Prisma with SQLite is sufficient for the assessment because:

- The dataset size is moderate at 10,000 employees
- Prisma improves maintainability and test readability
- SQLite keeps local setup simple and fast

### Database Model

The core model is `Employee`.

Planned indexes:

- `country`
- `jobTitle`
- `(country, jobTitle)`
- possibly `fullName` to support search ergonomics if needed

### Query Strategy

Employee listing will rely on database-backed pagination, filtering, and
sorting. Salary insight endpoints will use aggregation queries instead of
loading full datasets into Node.js memory.

Median salary is the one metric Prisma does not provide directly as a first
class aggregate. For that metric, the implementation will use raw SQL against
SQLite in a constrained and well-tested way.

## Frontend Design

### UI Library

Material UI is selected for this solution because:

- It provides high-quality table, form, dialog, and card primitives
- It works well with responsive dashboard layouts
- It reduces setup overhead relative to building a bespoke design system

### Rendering Strategy

The application will use the Next.js App Router. Pages can remain mostly server
composed while interactive filters, forms, and charts live in client components.

### Data Flow

- Page-level containers fetch or coordinate data
- Feature components render tables, forms, cards, and charts
- Shared helpers in `lib` normalize API contracts for UI use

## Testing Strategy

### Backend

- Unit tests for validation, domain logic, and seed utilities
- API tests with Supertest for endpoint behavior
- SQLite test database for integration-style repository coverage when needed

### Frontend

- React Testing Library for component behavior
- Focus on user-observable behavior rather than implementation details
- Mock network boundaries to keep tests fast and deterministic

## Performance Considerations

- Pagination avoids rendering or transferring large employee lists at once
- Filtering and sorting are executed at the database layer
- Aggregations are computed in SQL/Prisma queries
- Seed insertion will use batches inside transactions
- Deterministic generation avoids debugging noise across repeated runs

## Deployment Shape

The backend and frontend should be deployable independently.

- Frontend: Next.js app
- Backend: Node.js service
- Database: SQLite file for local/demo use

For a production-grade system with growth beyond the assessment, SQLite would
likely be replaced with PostgreSQL, but that is intentionally out of scope here.
