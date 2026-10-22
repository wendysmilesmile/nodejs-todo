import { webClient } from "../clients/WebClient";

type RemoteOrder = {
  id: string;
  amount: number;
};


const orderClient = webClient(
    process.env.ORDER_BACKEND_BASE_URL ?? "http://localhost:9002",
);

async function listOrders(): Promise<RemoteOrder[]> {
  return await orderClient.request<RemoteOrder[]>({
    method: "GET",    
    path : "/api/orders"
  });
}

export { listOrders };
