import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(code: string, message = "Forbidden") {
    super(message, code, 403);
  }
}
