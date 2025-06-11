export abstract class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  public readonly errors: string[];

  constructor(message: string, errors: string[] = []) {
    super(message, 400);
    this.errors = errors;
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}
