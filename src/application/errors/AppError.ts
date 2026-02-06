export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}
