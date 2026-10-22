import { WebClient } from "../clients/WebClient";

interface RemoteOrder {
  id: string;
  amount: number;
}

interface OrderBackendAdapter {
  listOrders(): Promise<RemoteOrder[]>;
}

function orderBackendAdapter(webClient: WebClient): OrderBackendAdapter {
  return {
    listOrders(): Promise<RemoteOrder[]> {
      return webClient.request<RemoteOrder[]>({
        method: "GET",
        path: "/api/orders"
      });
    }
  };
}

export { orderBackendAdapter };
export type { RemoteOrder, OrderBackendAdapter };
