export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeoutMs?: number;
}

export class HttpResponseError extends Error {
  constructor(
    public readonly status: number,
    public readonly responseBody: unknown,
    message = `HTTP request failed with status ${status}`
  ) {
    super(message);
  }
}

export class WebClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultHeaders: Record<string, string> = {}
  ) {}

  async request<T>(options: RequestOptions): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);

    try {
      const url = this.buildUrl(options.path, options.query);
      const response = await fetch(url, {
        method: options.method ?? "GET",
        headers: {
          "content-type": "application/json",
          ...this.defaultHeaders,
          ...options.headers
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal
      });

      const responseBody = await this.parseBody(response);

      if (!response.ok) {
        throw new HttpResponseError(response.status, responseBody);
      }

      return responseBody as T;
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildUrl(path: string, query?: RequestOptions["query"]): string {
    const url = new URL(path, this.baseUrl);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async parseBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    const text = await response.text();
    return text.length > 0 ? text : null;
  }
}
