import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '@/shared/utils/errors';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};
