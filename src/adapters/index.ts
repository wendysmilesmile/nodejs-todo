import { createDownstreamAdapters } from "./DownstreamFactory";

export const adapters = createDownstreamAdapters();

// Backward-compatible export for existing callers.
export const todoBackendAdapter = adapters.todo;
