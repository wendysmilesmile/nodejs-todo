import { WebClient } from "../clients/WebClient";

export interface RemoteOrder {
  id: string;
  amount: number;
}

export interface OrderBackendAdapter {
  listOrders(): Promise<RemoteOrder[]>;
}

export function createOrderBackendAdapter(webClient: WebClient): OrderBackendAdapter {
  return {
    listOrders(): Promise<RemoteOrder[]> {
      return webClient.request<RemoteOrder[]>({
        method: "GET",
        path: "/api/orders"
      });
    }
  };
}
