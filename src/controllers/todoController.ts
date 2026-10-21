import { Router, Request, Response, NextFunction } from "express";
import { ITodoService } from "../services/interfaces/ITodoService";

export function createTodoController(todoService: ITodoService): Router {
  const router = Router();

  router.get("/api/todo-items", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await todoService.getActiveItems();
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  });

  router.post("/api/todo-item", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const title = req.body?.title as string | undefined;
      const normalizedTitle = (title ?? "").trim();
      if (!normalizedTitle) {
        res.status(400).json({ message: "Title is required." });
        return;
      }
      const created = await todoService.createItem(normalizedTitle);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  });

  router.patch("/api/todo-item/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid id." });
      }
      const normalizedTitle = (req.body?.title as string | undefined)?.trim();
      if (!normalizedTitle) {
        return res.status(400).json({ message: "Title is required." });
      }
      const updated = await todoService.updateItem(id, normalizedTitle);
      return res.status(200).json(updated);
    } catch (error) {
      return next(error);
    }
  });

  router.get("/api/todo-item/search", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const user = req.user;
      // const userId = user?.email ?? "anonymous";
      const query = req.query?.q as string | undefined;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required." });
      }
      const items = await todoService.searchItems(query);
      return res.status(200).json(items);
    } catch (error) {
      return next(error);
    }
  });

  router.delete("/api/todo-item/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid id." });
      }

      await todoService.deleteItem(id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
