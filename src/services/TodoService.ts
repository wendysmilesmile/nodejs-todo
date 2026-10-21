import { TodoItem } from "../models/todoItem";
import { ITodoRepository } from "../repositories/interfaces/ITodoRepository";
import { ITodoService } from "./interfaces/ITodoService";
import { createHttpError } from "../types/httpError";

export class TodoService implements ITodoService {
  constructor(private readonly todoRepository: ITodoRepository) {
  }
    searchItems(query: string): Promise<TodoItem[]> {
        return this.todoRepository.searchItems(query);
    }

  async getActiveItems(): Promise<TodoItem[]> {
    return this.todoRepository.getAll();
  }

  async createItem(title: string): Promise<TodoItem> {
    return this.todoRepository.add(title);
  }

  async updateItem(id: number, title: string): Promise<TodoItem> {
    const existing = await this.todoRepository.findById(id);
    if (!existing || existing.isDeleted) {
      throw createHttpError("Todo item not found.", 404);
    }

    return (await this.todoRepository.updateTitle(id, title)) as TodoItem;
  }

  async deleteItem(id: number): Promise<void> {
    const existing = await this.todoRepository.findById(id);
    if (!existing || existing.isDeleted) {
      throw createHttpError("Todo item not found.", 404);
    }

    await this.todoRepository.softDelete(id);
  }
}
