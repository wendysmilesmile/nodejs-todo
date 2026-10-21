import { WebClient } from "../clients/WebClient";
import { OrderBackendAdapter } from "./OrderBackendAdapter";
import { TodoBackendAdapter } from "./TodoBackendAdapter";
import { UserBackendAdapter } from "./UserBackendAdapter";

export interface DownstreamAdapters {
  todo: TodoBackendAdapter;
  user: UserBackendAdapter;
  order: OrderBackendAdapter;
}

export class DownstreamFactory {
  static create(): DownstreamAdapters {
    const commonHeaders = {
      "x-bff-service": "todoservice-node"
    };

    const todoClient = new WebClient(
      process.env.TODO_BACKEND_BASE_URL ?? "http://localhost:9000",
      commonHeaders
    );

    const userClient = new WebClient(
      process.env.USER_BACKEND_BASE_URL ?? "http://localhost:9001",
      commonHeaders
    );

    const orderClient = new WebClient(
      process.env.ORDER_BACKEND_BASE_URL ?? "http://localhost:9002",
      commonHeaders
    );

    return {
      todo: new TodoBackendAdapter(todoClient),
      user: new UserBackendAdapter(userClient),
      order: new OrderBackendAdapter(orderClient)
    };
  }
}
