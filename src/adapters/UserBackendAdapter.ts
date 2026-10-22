import { WebClient } from "../clients/WebClient";

interface RemoteUser {
  id: string;
  name: string;
}

interface UserBackendAdapter {
  listUsers(): Promise<RemoteUser[]>;
}

function userBackendAdapter(webClient: WebClient): UserBackendAdapter {
  return {
    listUsers(): Promise<RemoteUser[]> {
      return webClient.request<RemoteUser[]>({
        method: "GET",
        path: "/api/users"
      });
    }
  };
}

export { userBackendAdapter };
export type { RemoteUser, UserBackendAdapter };
