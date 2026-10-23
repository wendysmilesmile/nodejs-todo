import { logger } from "../utils/logger";

type CursorPage = {
  data?: unknown[];
  items?: unknown[];
  nextCursor?: string | null;
  next_cursor?: string | null;
  cursor?: string | null;
};

type CursorTaskResult = {
  cursor: string;
  page: CursorPage;
};

const START_CURSOR = "__START__";
const MAX_PAGES = 1000;
const MAX_CURSOR_RETRY = 2;

function buildPageUrl(url: string, cursor?: string): string {
  const pageUrl = new URL(url);
  if (cursor) {
    pageUrl.searchParams.set("cursor", cursor);
  }

  return pageUrl.toString();
}

function getNextCursor(page: CursorPage): string | null {
  return page.nextCursor ?? page.next_cursor ?? page.cursor ?? null;
}

function getItems(page: CursorPage): unknown[] {
  if (Array.isArray(page.data)) {
    return page.data;
  }

  if (Array.isArray(page.items)) {
    return page.items;
  }

  return [];
}

async function fetchPage(
  url: string,
  apiKey: string,
  cursor: string,
): Promise<CursorTaskResult> {
  const pageUrl = buildPageUrl(
    url,
    cursor === START_CURSOR ? undefined : cursor,
  );
  const response = await fetch(pageUrl, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${pageUrl}: ${response.statusText}`,
    );
  }

  const page = (await response.json()) as CursorPage;
  return { cursor, page };
}

async function fetchData(url: string, cursor?: string): Promise<unknown[]> {
  const allItems: unknown[] = [];
  let pageCount = 0;
  const apiKey = process.env.API_KEY;
  const visited = new Set<string>();
  const retryCount = new Map<string, number>();
  const failedCursors: string[] = [];

  let pendingCursors: string[] = [cursor ?? START_CURSOR];

  if (!apiKey) {
    throw new Error("Missing API_KEY in environment variables");
  }

  try {
    while (pendingCursors.length > 0) {
      const uniquePending = pendingCursors.filter((currentCursor) => {
        if (visited.has(currentCursor)) {
          return false;
        }

        visited.add(currentCursor);
        return true;
      });

      if (uniquePending.length === 0) {
        break;
      }

      const settled = await Promise.allSettled(
        uniquePending.map((currentCursor) =>
          fetchPage(url, apiKey, currentCursor),
        ),
      );

      const nextRoundCursors: string[] = [];

      settled.forEach((result, index) => {
        const currentCursor = uniquePending[index];

        if (result.status === "fulfilled") {
          pageCount += 1;
          allItems.push(...getItems(result.value.page));

          const nextCursor = getNextCursor(result.value.page);
          if (nextCursor) {
            nextRoundCursors.push(nextCursor);
          }

          return;
        }

        const currentRetry = retryCount.get(currentCursor) ?? 0;
        const nextRetry = currentRetry + 1;
        retryCount.set(currentCursor, nextRetry);

        logger.error(
          {
            url,
            cursor: currentCursor,
            retry: nextRetry,
            err: result.reason,
          },
          "ExternalDataAdapter.fetchData page failed",
        );

        if (nextRetry <= MAX_CURSOR_RETRY) {
          nextRoundCursors.push(currentCursor);
          visited.delete(currentCursor);
          return;
        }

        failedCursors.push(currentCursor);
      });

      pendingCursors = nextRoundCursors;

      if (pageCount >= MAX_PAGES) {
        throw new Error("Cursor pagination exceeded safety limit (1000 pages)");
      }
    }

    if (failedCursors.length > 0) {
      logger.error(
        {
          url,
          failedCursors,
          pageCount,
        },
        "ExternalDataAdapter.fetchData completed with failed cursors",
      );
    }

    return allItems;
  } catch (error) {
    logger.error(
      {
        url,
        cursor,
        pageCount,
        err: error,
      },
      "ExternalDataAdapter.fetchData failed",
    );
    return Promise.reject(error);
  }
}

export { fetchData };
