import { TodoItem } from "../../src/models/todoItem";
import { ITodoRepository } from "../../src/repositories/interfaces/ITodoRepository";

export function createFakeTodoRepository(): ITodoRepository {
  const items: TodoItem[] = [];
  let nextId = 1;

  return {
    async searchItems(query: string): Promise<TodoItem[]> {
      const lowerCaseQuery = query.toLowerCase();
      const filteredItems = items.filter((item) => item.title.toLowerCase().includes(lowerCaseQuery));
      return Promise.resolve(filteredItems);
    },

    async getAll(): Promise<TodoItem[]> {
      const filteredItems = items.filter((item) => !item.isDeleted);
      return filteredItems;
    },

    async findById(id: number): Promise<TodoItem | null> {
      return items.find((item) => item.id === id) ?? null;
    },

    async add(title: string): Promise<TodoItem> {
      const now = new Date().toISOString();
      const item: TodoItem = {
        id: nextId++,
        title,
        isDeleted: false,
        createdAt: now,
        updatedAt: now
      };

      items.push(item);
      return item;
    },

    async updateTitle(id: number, title: string): Promise<TodoItem | null> {
      const item = items.find((todo) => todo.id === id);
      if (!item) {
        return null;
      }

      item.title = title;
      item.updatedAt = new Date().toISOString();
      return item;
    },

    async softDelete(id: number): Promise<TodoItem | null> {
      const item = items.find((todo) => todo.id === id);
      if (!item) {
        return null;
      }

      item.isDeleted = true;
      item.updatedAt = new Date().toISOString();
      return item;
    }
  };
}
