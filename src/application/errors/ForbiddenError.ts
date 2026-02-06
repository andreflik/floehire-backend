import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(code: string, message = "Resource not found") {
    super(message, code, 404);
  }
}
