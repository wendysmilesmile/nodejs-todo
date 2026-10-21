import { TodoItem } from "../../models/todoItem";

export interface ITodoService {
  getActiveItems(): Promise<TodoItem[]>;
  createItem(title: string): Promise<TodoItem>;
  updateItem(id: number, title: string): Promise<TodoItem>;
  deleteItem(id: number): Promise<void>;
  searchItems(query: string): Promise<TodoItem[]>;
}
