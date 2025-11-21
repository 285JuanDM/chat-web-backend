// shared/errors/UnauthorizedError.js
import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
