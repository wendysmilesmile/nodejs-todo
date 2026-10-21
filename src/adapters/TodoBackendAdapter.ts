import { WebClient } from "../clients/WebClient";

export interface RemoteTodoItem {
  id: number;
  title: string;
  isDeleted: boolean;
}

export interface TodoBackendAdapter {
  listTodos(): Promise<RemoteTodoItem[]>;
  createTodo(title: string): Promise<RemoteTodoItem>;
}

export function createTodoBackendAdapter(webClient: WebClient): TodoBackendAdapter {
  return {
    listTodos(): Promise<RemoteTodoItem[]> {
      return webClient.request<RemoteTodoItem[]>({
        method: "GET",
        path: "/api/todo-items"
      });
    },

    createTodo(title: string): Promise<RemoteTodoItem> {
      return webClient.request<RemoteTodoItem>({
        method: "POST",
        path: "/api/todo-item",
        body: { title }
      });
    }
  };
}
