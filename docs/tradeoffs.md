# Tradeoffs

## SQLite Instead of PostgreSQL

SQLite keeps the assessment simple to run and test, which is valuable for a
take-home project. The tradeoff is reduced concurrency and fewer advanced SQL
features compared with a networked production database.

## Material UI Instead of shadcn/ui

Material UI gives us strong table, form, dialog, and dashboard primitives with
less setup overhead. The tradeoff is a more opinionated visual system and a
larger dependency footprint.

## REST Instead of GraphQL

REST is a better fit for this scope because the workflows are centered around
CRUD and reporting with a small number of screens. The tradeoff is less
flexibility for clients that want highly customized data shapes.

## Prisma Instead of Raw SQL Everywhere

Prisma improves readability, schema evolution, and test ergonomics. The tradeoff
is that some advanced queries, especially median calculation, may still require
targeted raw SQL.

## Clean Architecture, Lightly Applied

The codebase will separate domain, application, infrastructure, and presentation
concerns, but it will avoid ceremony that does not pay off for a small system.
The tradeoff is that some boundaries may remain pragmatic rather than fully
formalized.

## Next.js App Router Instead of a Separate SPA

Next.js provides a strong foundation and straightforward routing. The tradeoff
is that server and client component boundaries must be handled carefully,
especially with third-party UI libraries.

## Deterministic Seed Data Instead of Random-Only Generation

Deterministic generation makes test and demo results stable across runs. The
tradeoff is slightly less natural-looking distribution unless the generation
rules are designed carefully.

## Separate Docs Commit Before Failing Tests

Keeping documentation before failing tests makes the repo easier to review and
explains why later tests exist. The tradeoff is one extra commit, but it
improves the narrative of the solution.
