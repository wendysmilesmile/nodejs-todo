import { DownstreamFactory } from "./DownstreamFactory";

export const adapters = DownstreamFactory.create();

// Backward-compatible export for existing callers.
export const todoBackendAdapter = adapters.todo;
