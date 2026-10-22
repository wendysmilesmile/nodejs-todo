import { WebClient } from "../clients/WebClient";

interface RemoteTodoItem {
  id: number;
  title: string;
  isDeleted: boolean;
}

interface TodoBackendAdapter {
  listTodos(): Promise<RemoteTodoItem[]>;
  createTodo(title: string): Promise<RemoteTodoItem>;
}

function todoBackendAdapter(webClient: WebClient): TodoBackendAdapter {
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

export { todoBackendAdapter };
export type { RemoteTodoItem, TodoBackendAdapter };
