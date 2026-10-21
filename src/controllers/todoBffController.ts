import { NextFunction, Request, Response, Router } from "express";
import { DownstreamAdapters } from "../adapters/DownstreamFactory";
import { HttpResponseError } from "../clients/WebClient";

export function createTodoBffController(adapters: DownstreamAdapters): Router {
  const router = Router();

  router.get("/api/bff/todo-items", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await adapters.todo.listTodos();
      res.status(200).json(items);
    } catch (error) {
      if (error instanceof HttpResponseError) {
        return res.status(502).json({
          message: "Downstream todo service failed.",
          downstreamStatus: error.status,
          downstreamBody: error.responseBody
        });
      }

      return next(error);
    }
  });

  router.get("/api/bff/downstream-summary", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [todos, users, orders] = await Promise.all([
        adapters.todo.listTodos(),
        adapters.user.listUsers(),
        adapters.order.listOrders()
      ]);

      return res.status(200).json({
        todos,
        users,
        orders
      });
    } catch (error) {
      if (error instanceof HttpResponseError) {
        return res.status(502).json({
          message: "Downstream service failed.",
          downstreamStatus: error.status,
          downstreamBody: error.responseBody
        });
      }

      return next(error);
    }
  });

  return router;
}
