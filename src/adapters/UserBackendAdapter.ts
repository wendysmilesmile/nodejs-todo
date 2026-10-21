import { WebClient } from "../clients/WebClient";

export interface RemoteUser {
  id: string;
  name: string;
}

export interface UserBackendAdapter {
  listUsers(): Promise<RemoteUser[]>;
}

export function createUserBackendAdapter(webClient: WebClient): UserBackendAdapter {
  return {
    listUsers(): Promise<RemoteUser[]> {
      return webClient.request<RemoteUser[]>({
        method: "GET",
        path: "/api/users"
      });
    }
  };
}
