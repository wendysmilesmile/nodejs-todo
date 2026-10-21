import { WebClient } from "../clients/WebClient";

export interface RemoteOrder {
  id: string;
  amount: number;
}

export class OrderBackendAdapter {
  constructor(private readonly webClient: WebClient) {}

  listOrders(): Promise<RemoteOrder[]> {
    return this.webClient.request<RemoteOrder[]>({
      method: "GET",
      path: "/api/orders"
    });
  }
}
