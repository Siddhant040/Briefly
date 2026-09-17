export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(
    message: string,
    statusCode: number,
    code: string,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}