import { TodoItem } from "../../src/models/todoItem";
import { ITodoRepository } from "../../src/repositories/interfaces/ITodoRepository";

export class FakeTodoRepository implements ITodoRepository {
  private readonly items: TodoItem[] = [];
  private nextId = 1;

  async searchItems(query: string): Promise<TodoItem[]> {
    const lowerCaseQuery = query.toLowerCase();
    const filteredItems = this.items.filter((item) =>
      item.title.toLowerCase().includes(lowerCaseQuery)
    );
    return Promise.resolve(filteredItems);
  }
  

  async getAll(): Promise<TodoItem[]> {
    const filteredItems = this.items.filter((item) => !item.isDeleted);
    return filteredItems;
  }

  async findById(id: number): Promise<TodoItem | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async add(title: string): Promise<TodoItem> {
    const now = new Date().toISOString();
    const item: TodoItem = {
      id: this.nextId++,
      title,
      isDeleted: false,
      createdAt: now,
      updatedAt: now
    };

    this.items.push(item);
    return item;
  }

  async updateTitle(id: number, title: string): Promise<TodoItem | null> {
    const item = this.items.find((todo) => todo.id === id);
    if (!item) {
      return null;
    }

    item.title = title;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  async softDelete(id: number): Promise<TodoItem | null> {
    const item = this.items.find((todo) => todo.id === id);
    if (!item) {
      return null;
    }

    item.isDeleted = true;
    item.updatedAt = new Date().toISOString();
    return item;
  }
}
