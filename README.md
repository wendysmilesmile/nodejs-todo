# ToDoService (Node.js + TypeScript + PostgreSQL)

A demo Express Web API for managing a todo list with PostgreSQL storage.

## Features

- List active todo items
- Add a new todo item
- Soft-delete a todo item (`isDeleted = true`)
- Layered architecture: Controller -> Service -> Repository
- Function-based modules (no class-based service/repository)
- Async/await from controller to repository
- SQL migrations managed by db-migrate

## Architecture (as requested)

- `app.ts`: Express app wiring, middleware, router mounting
- `controllers/todoController.ts`: todo HTTP handlers
- `services/TodoService.ts`: business logic exported as functions
- `repositories/PostgresTodoRepository.ts`: PostgreSQL queries
- `db/postgresPool.ts`: shared PostgreSQL pool
- `migrations/`: db-migrate migration files (JS + timestamped SQL)

## Project Structure

- `src/app.ts` - app wiring and middleware
- `src/controllers/todoController.ts` - HTTP routes
- `src/repositories/PostgresTodoRepository.ts`
- `src/db/postgresPool.ts`
- `src/services/TodoService.ts`
- `src/clients/WebClient.ts` - outbound HTTP client helper
- `src/adapters/OrderBackendAdapter.ts` - simple adapter function example
- `tests/todo.api.test.ts` - API tests

## API Endpoints

- `GET /api/todo-items`
- `POST /api/todo-item`
- `PATCH /api/todo-item/{id}`
- `DELETE /api/todo-item/{id}`
- `GET /api/todo-item/search?q=keyword`

## Database Migration

```bash
npm run migrate:up
```

Create a new timestamped SQL migration:

```bash
npm run migrate:create -- your-migration-name
```

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Development Run

Create local env file first:

```bash
cp .env.example .env
```

```bash
npm run dev
```

Required environment variables (defaults shown):

- `PG_HOST` (`localhost`)
- `PG_PORT` (`5432`)
- `PG_USER` (`postgres`)
- `PG_PASSWORD` (`postgres`)
- `PG_DATABASE` (`todoservice`)
- `JWT_SECRET` (`change-me-in-local-and-prod`)

## Build + Production Run

```bash
npm run build
npm start
```

Default base URL:

```text
http://localhost:3000
```

## Unit Tests

```bash
npm test
```

## Docker (One-Command Startup)

```bash
docker compose -f docker-compose.yml up --build -d
```

This starts both:

- `todoservice` (Express API)
- `postgres` (database)

API base URL after startup:

```text
http://localhost:8080
```

Stop and remove the container:

```bash
docker compose -f docker-compose.yml down
```

## Notes

- Data is persisted in PostgreSQL.
- `DELETE` is a soft delete.
