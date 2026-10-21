import { TodoItem } from "../../models/todoItem";

export interface ITodoRepository {
  getAll(): Promise<TodoItem[]>;
  findById(id: number): Promise<TodoItem | null>;
  add(title: string): Promise<TodoItem>;
  updateTitle(id: number, title: string): Promise<TodoItem | null>;
  softDelete(id: number): Promise<TodoItem | null>;
  searchItems(query: string): Promise<TodoItem[]>;
}
