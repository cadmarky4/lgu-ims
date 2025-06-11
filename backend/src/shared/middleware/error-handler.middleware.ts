import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { BaseError, ValidationError } from '@/shared/utils/errors';
import { ApiResponseBuilder } from '@/shared/utils/api-response';
import { logger } from '@/shared/utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    const response = ApiResponseBuilder.validationError(errors);
    res.status(400).json(response);
    return;
  }

  // Handle custom validation errors
  if (error instanceof ValidationError) {
    const response = ApiResponseBuilder.validationError(error.errors);
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle custom base errors
  if (error instanceof BaseError) {
    const response = ApiResponseBuilder.error(error.message);
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  const response = ApiResponseBuilder.error('Internal server error');
  res.status(500).json(response);
};
