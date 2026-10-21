import { WebClient } from "../clients/WebClient";

export interface RemoteUser {
  id: string;
  name: string;
}

export class UserBackendAdapter {
  constructor(private readonly webClient: WebClient) {}

  listUsers(): Promise<RemoteUser[]> {
    return this.webClient.request<RemoteUser[]>({
      method: "GET",
      path: "/api/users"
    });
  }
}
