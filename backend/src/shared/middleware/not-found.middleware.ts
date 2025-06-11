import { Request, Response } from 'express';
import { ApiResponseBuilder } from '@/shared/utils/api-response';

export const notFoundHandler = (req: Request, res: Response): void => {
  const response = ApiResponseBuilder.error(
    `Route ${req.originalUrl} not found`
  );
  res.status(404).json(response);
};
