type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeoutMs?: number;
};

type HttpResponseError = Error & {
  status: number;
  responseBody: unknown;
};

type WebClient = {
  request: <T>(options: RequestOptions) => Promise<T>;
};

function httpResponseError(
  status: number,
  responseBody: unknown,
  message = `HTTP request failed with status ${status}`
): HttpResponseError {
  const error = new Error(message) as HttpResponseError;
  error.status = status;
  error.responseBody = responseBody;
  return error;
}

function isHttpResponseError(error: unknown): error is HttpResponseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "responseBody" in error
  );
}

function webClient(
  baseUrl: string,
  defaultHeaders: Record<string, string> = {}
): WebClient {
  const buildUrl = (path: string, query?: RequestOptions["query"]): string => {
    const url = new URL(path, baseUrl);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  };

  const parseBody = async (response: Response): Promise<unknown> => {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    const text = await response.text();
    return text.length > 0 ? text : null;
  };

  return {
    async request<T>(options: RequestOptions): Promise<T> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);

      try {
        const url = buildUrl(options.path, options.query);
        const response = await fetch(url, {
          method: options.method ?? "GET",
          headers: {
            "content-type": "application/json",
            ...defaultHeaders,
            ...options.headers
          },
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: controller.signal
        });

        const responseBody = await parseBody(response);

        if (!response.ok) {
          throw httpResponseError(response.status, responseBody);
        }

        return responseBody as T;
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}

export { httpResponseError, isHttpResponseError, webClient };
export type { HttpResponseError, RequestOptions, WebClient };
