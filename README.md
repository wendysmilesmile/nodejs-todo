# ToDoService (Node.js + TypeScript + PostgreSQL)

A demo Express Web API for managing a todo list with PostgreSQL storage.

## Features

- List active todo items
- Add a new todo item
- Soft-delete a todo item (`isDeleted = true`)
- Layered architecture: Controller -> Service -> Repository
- TypeScript interface + concrete implementation
- Async/await from controller to repository

## Architecture (as requested)

Repository layer:

- `ITodoRepository` (interface)
- `BaseTodoRepository` (type alias)
- `PostgresTodoRepository` (concrete repository)

Service layer:

- `ITodoService` (interface)
- `TodoService` (concrete service)

## Project Structure

- `src/app.ts` - app wiring (DI-style composition root)
- `src/controllers/todoController.ts` - HTTP routes
- `src/repositories/interfaces/ITodoRepository.ts`
- `src/repositories/base/BaseTodoRepository.ts`
- `src/repositories/PostgresTodoRepository.ts`
- `src/db/postgresPool.ts`
- `src/services/interfaces/ITodoService.ts`
- `src/services/TodoService.ts`
- `src/clients/WebClient.ts` - unified outbound HTTP client
- `src/adapters/TodoBackendAdapter.ts` - downstream service adapter example
- `src/adapters/index.ts` - adapter wiring (BFF style)
- `tests/todo.api.test.ts` - API tests

## API Endpoints

- `GET /api/todo-items`
- `POST /api/todo-item`
- `PATCH /api/todo-item/{id}`
- `DELETE /api/todo-item/{id}`

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
docker compose -f deploy/docker-compose.yml up --build -d
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
docker compose -f deploy/docker-compose.yml down
```

## Notes

- Data is persisted in PostgreSQL.
- `DELETE` is a soft delete.
