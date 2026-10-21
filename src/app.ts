import express, { NextFunction, Request, Response } from "express";
import { createTodoController } from "./controllers/todoController";
import { createTodoBffController } from "./controllers/todoBffController";
import { ITodoRepository } from "./repositories/interfaces/ITodoRepository";
import { PostgresTodoRepository } from "./repositories/PostgresTodoRepository";
import { TodoService } from "./services/TodoService";
import { HttpError } from "./types/httpError";
import { adapters } from "./adapters";
import { getPostgresPool } from "./db/postgresPool";

interface CreateAppOptions {
  todoRepository?: ITodoRepository;
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();

  const repository = options.todoRepository ?? new PostgresTodoRepository(getPostgresPool());
  const todoService = new TodoService(repository);

  app.use(express.json());
  app.use(createTodoController(todoService));
  app.use(createTodoBffController(adapters));

  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message;
    console.error("日志记录：", err.stack); // 记录错误日志
    res.status(statusCode).json({ message });
  });

  return app;
}
