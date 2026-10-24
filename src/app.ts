import "./config/env";
import express, { NextFunction, Request, Response } from "express";
import { router as todoRouter } from "./controllers/todoController";
import { HttpError } from "./types/httpError";
import { jwtVerify, JWTPayload } from "jose";
import { dataRouter } from "./controllers/dataController";
import { logger } from "./utils/logger";

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
    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs,
      },
      "HTTP request completed",
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
      logger.error(
        {
          method: req.method,
          url: req.originalUrl,
          statusCode,
          err,
        },
        "Request failed",
      );
      res.status(statusCode).json({ message });
    },
  );

  return app;
}

export { app };
