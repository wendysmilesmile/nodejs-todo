import { TodoItem } from "../models/todoItem";
import { ITodoRepository } from "../repositories/interfaces/ITodoRepository";
import { ITodoService } from "./interfaces/ITodoService";
import { createHttpError } from "../types/httpError";

export function createTodoService(todoRepository: ITodoRepository): ITodoService {
  return {
    searchItems(query: string): Promise<TodoItem[]> {
      return todoRepository.searchItems(query);
    },

    async getActiveItems(): Promise<TodoItem[]> {
      return todoRepository.getAll();
    },

    async createItem(title: string): Promise<TodoItem> {
      return todoRepository.add(title);
    },

    async updateItem(id: number, title: string): Promise<TodoItem> {
      const existing = await todoRepository.findById(id);
      if (!existing || existing.isDeleted) {
        throw createHttpError("Todo item not found.", 404);
      }

      return (await todoRepository.updateTitle(id, title)) as TodoItem;
    },

    async deleteItem(id: number): Promise<void> {
      const existing = await todoRepository.findById(id);
      if (!existing || existing.isDeleted) {
        throw createHttpError("Todo item not found.", 404);
      }

      await todoRepository.softDelete(id);
    }
  };
}
