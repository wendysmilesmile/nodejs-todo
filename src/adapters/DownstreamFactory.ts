import { createWebClient } from "../clients/WebClient";
import { createOrderBackendAdapter, OrderBackendAdapter } from "./OrderBackendAdapter";
import { createTodoBackendAdapter, TodoBackendAdapter } from "./TodoBackendAdapter";
import { createUserBackendAdapter, UserBackendAdapter } from "./UserBackendAdapter";

export interface DownstreamAdapters {
  todo: TodoBackendAdapter;
  user: UserBackendAdapter;
  order: OrderBackendAdapter;
}

export function createDownstreamAdapters(): DownstreamAdapters {
  const commonHeaders = {
    "x-bff-service": "todoservice-node"
  };

  const todoClient = createWebClient(
    process.env.TODO_BACKEND_BASE_URL ?? "http://localhost:9000",
    commonHeaders
  );

  const userClient = createWebClient(
    process.env.USER_BACKEND_BASE_URL ?? "http://localhost:9001",
    commonHeaders
  );

  const orderClient = createWebClient(
    process.env.ORDER_BACKEND_BASE_URL ?? "http://localhost:9002",
    commonHeaders
  );

  return {
    todo: createTodoBackendAdapter(todoClient),
    user: createUserBackendAdapter(userClient),
    order: createOrderBackendAdapter(orderClient)
  };
}
