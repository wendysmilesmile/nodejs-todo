import "./config/env";
import express, { NextFunction, Request, Response } from "express";
import { router as todoRouter } from "./controllers/todoController";
import {
  addItem,
  deleteItem,
  getActiveItems,
  searchItems,
  updateItem
} from "./services/TodoService";
import { HttpError } from "./types/httpError";
import { jwtVerify, JWTPayload } from "jose";
import { TodoItem } from "./models/todoItem";

type TodoServiceFunctions = {
  searchItems: (query: string) => Promise<TodoItem[]>;
  getActiveItems: () => Promise<TodoItem[]>;
  addItem: (title: string) => Promise<TodoItem>;
  updateItem: (id: number, title: string) => Promise<TodoItem>;
  deleteItem: (id: number) => Promise<void>;
};

interface AppOptions {
  todoService?: TodoServiceFunctions;
}
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload; // 或根据需要定义用户类型
    }
  }
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret");

function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`
    );
  });

  next();
}

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

function app(options: AppOptions = {}) {
  const app = express();

  const todoService = options.todoService ?? {
    searchItems,
    getActiveItems,
    addItem,
    updateItem,
    deleteItem
  };


  app.use(express.json());
  app.use(requestLogger);
  app.use(authMiddleware);
  
  app.use(todoRouter);

  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message;
    console.error("日志记录：", err.stack); // 记录错误日志
    res.status(statusCode).json({ message });
  });

  return app;
}

export { app };
