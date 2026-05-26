# AI Usage Log

## Purpose

This document records how AI was used during development and what safeguards
were applied to keep the result correct and maintainable.

## Working Principles

- Use AI to accelerate scaffolding, documentation, and repetitive structure
- Keep architectural decisions explicit and reviewable
- Validate generated code through linting, typechecking, and tests
- Prefer incremental commits so the evolution of the solution remains clear

## Usage So Far

### Commit 1: Project Setup

- AI was used to scaffold the monorepo structure
- AI was used to generate initial backend and frontend setup files
- Outputs were manually reviewed and adjusted to work in the local Windows
  environment
- Validation was performed with lint, typecheck, and tests

### Commit 2: Product and Architecture Docs

- AI was used to synthesize the assessment prompt and the source document into
  explicit product requirements
- AI was used to draft architecture decisions and tradeoff notes
- The resulting docs were reviewed to ensure they match the intended delivery

## Planned Safeguards For Later Commits

- Write tests before implementation for business features
- Keep APIs and database queries intentionally simple
- Use database aggregations for insights rather than loading all rows in memory
- Refactor only after tests cover the behavior

## Known Gaps

- The name source files `first_names.txt` and `last_names.txt` have not yet been
  added to the repository
- Seeding design will be finalized once those inputs are available
