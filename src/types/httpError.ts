export interface HttpError extends Error {
  statusCode?: number;
}

function httpError(message: string, statusCode: number): HttpError {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
}

export { httpError };
