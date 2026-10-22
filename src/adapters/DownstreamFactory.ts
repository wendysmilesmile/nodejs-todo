import { webClient } from "../clients/WebClient";
import { orderBackendAdapter, OrderBackendAdapter } from "./OrderBackendAdapter";
import { todoBackendAdapter, TodoBackendAdapter } from "./TodoBackendAdapter";
import { userBackendAdapter, UserBackendAdapter } from "./UserBackendAdapter";

interface DownstreamAdapters {
  todo: TodoBackendAdapter;
  user: UserBackendAdapter;
  order: OrderBackendAdapter;
}

function downstreamAdapters(): DownstreamAdapters {
  const commonHeaders = {
    "x-bff-service": "todoservice-node"
  };

  const todoClient = webClient(
    process.env.TODO_BACKEND_BASE_URL ?? "http://localhost:9000",
    commonHeaders
  );

  const userClient = webClient(
    process.env.USER_BACKEND_BASE_URL ?? "http://localhost:9001",
    commonHeaders
  );

  const orderClient = webClient(
    process.env.ORDER_BACKEND_BASE_URL ?? "http://localhost:9002",
    commonHeaders
  );

  return {
    todo: todoBackendAdapter(todoClient),
    user: userBackendAdapter(userClient),
    order: orderBackendAdapter(orderClient)
  };
}

export { downstreamAdapters };
export type { DownstreamAdapters };
