import "./config/env";
import express, { NextFunction, Request, Response } from "express";
import { router as todoRouter } from "./controllers/todoController";
import { HttpError } from "./types/httpError";
import { jwtVerify, JWTPayload } from "jose";
import { dataRouter } from "./controllers/dataController";

declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
  }
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret");

function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`,
    );
  });

  next();
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    const token = auth.replace("Bearer ", "").trim();
    const { payload } = await jwtVerify(token, secret);
    req.user = payload;
    next();
    return;
  } catch (error) {
    next(error);
    return;
  }
}

function app() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);
  app.use(authMiddleware);

  app.use(todoRouter);
  app.use(dataRouter);
  app.use(
    (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
      const statusCode = err.statusCode ?? 500;
      const message =
        statusCode === 500 ? "Internal Server Error" : err.message;
      console.error("日志记录：", err.stack); // 记录错误日志
      res.status(statusCode).json({ message });
    },
  );

  return app;
}

export { app };
