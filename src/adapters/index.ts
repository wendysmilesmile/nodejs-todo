import { downstreamAdapters } from "./DownstreamFactory";

const adapters = downstreamAdapters();

// Backward-compatible export for existing callers.
const todoBackendAdapter = adapters.todo;

export { adapters, todoBackendAdapter };
