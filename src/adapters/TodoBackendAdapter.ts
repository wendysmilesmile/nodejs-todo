import { WebClient } from "../clients/WebClient";

export interface RemoteTodoItem {
  id: number;
  title: string;
  isDeleted: boolean;
}

export class TodoBackendAdapter {
  constructor(private readonly webClient: WebClient) {}

  listTodos(): Promise<RemoteTodoItem[]> {
    return this.webClient.request<RemoteTodoItem[]>({
      method: "GET",
      path: "/api/todo-items"
    });
  }

  createTodo(title: string): Promise<RemoteTodoItem> {
    return this.webClient.request<RemoteTodoItem>({
      method: "POST",
      path: "/api/todo-item",
      body: { title }
    });
  }
}
