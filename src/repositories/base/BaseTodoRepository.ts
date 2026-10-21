import { ITodoRepository } from "../interfaces/ITodoRepository";
import { TodoItem } from "../../models/todoItem";

// export abstract class BaseTodoRepository implements ITodoRepository {
//   abstract getAll(): Promise<TodoItem[]>;
//   abstract findById(id: number): Promise<TodoItem | null>;
//   abstract add(title: string): Promise<TodoItem>;
//   abstract updateTitle(id: number, title: string): Promise<TodoItem | null>;
//   abstract softDelete(id: number): Promise<TodoItem | null>;
// }
