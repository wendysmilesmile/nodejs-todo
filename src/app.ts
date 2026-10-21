import "./config/env";
import express, { NextFunction, Request, Response } from "express";
import { createTodoController } from "./controllers/todoController";
import { createTodoBffController } from "./controllers/todoBffController";
import { ITodoRepository } from "./repositories/interfaces/ITodoRepository";
import { createPostgresTodoRepository } from "./repositories/PostgresTodoRepository";
import { createTodoService } from "./services/TodoService";
import { HttpError } from "./types/httpError";
import { adapters } from "./adapters";
import { getPostgresPool } from "./db/postgresPool";
import { jwtVerify, JWTPayload } from "jose";

interface CreateAppOptions {
  todoRepository?: ITodoRepository;
}
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload; // 或根据需要定义用户类型
    }
  }
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret");

async function authMiddleware(req: Request, res: Response, next: NextFunction) {  
  const auth = req.header("authorization");
  // Check if the Authorization header is present and starts with "Bearer "
  // if not, just to next middleware without doing anything
  if (!auth?.startsWith("Bearer ")) { 
    next();
    return; 
  }
  try {
    const token = auth.replace("Bearer ", "").trim();
    const { payload } = await jwtVerify(token, secret);
    req.user = payload;
  } finally {
    return next();
  }
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();

  const repository = options.todoRepository ?? createPostgresTodoRepository(getPostgresPool());
  const todoService = createTodoService(repository);

  app.use(express.json());
  app.use(authMiddleware);
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
