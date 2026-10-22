import { TodoItem } from "../models/todoItem";
import {
  add,
  findById,
  getAll,
  searchItems as searchTodoItems,
  softDelete,
  updateTitle
} from "../repositories/PostgresTodoRepository";
import { httpError } from "../types/httpError";

async function searchItems(query: string): Promise<TodoItem[]> {
  return searchTodoItems(query);
}

async function getActiveItems(): Promise<TodoItem[]> {
  return getAll();
}

async function addItem(title: string): Promise<TodoItem> {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw httpError("Title is required.", 400);
  }

  return add(normalizedTitle);
}

async function updateItem(id: number, title: string): Promise<TodoItem> {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw httpError("Title is required.", 400);
  }

  const existing = await findById(id);
  if (!existing || existing.isDeleted) {
    throw httpError("Todo item not found.", 404);
  }

  const updated = await updateTitle(id, normalizedTitle);

  if (!updated) {
    throw httpError("Todo item not found.", 404);
  }

  return updated;
}

async function deleteItem(id: number): Promise<void> {
  const existing = await findById(id);
  if (!existing || existing.isDeleted) {
    throw httpError("Todo item not found.", 404);
  }

  const deleted = await softDelete(id);

  if (!deleted) {
    throw httpError("Todo item not found.", 404);
  }
}

export { searchItems, getActiveItems, addItem, updateItem, deleteItem };
