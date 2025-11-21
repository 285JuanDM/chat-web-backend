// shared/errors/ValidationError.js
import { AppError } from "./AppError.js";

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 400);
  }
}
