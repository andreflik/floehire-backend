import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(code: string, message = "Unauthorized") {
    super(message, code, 401);
  }
}
