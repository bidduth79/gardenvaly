/**
 * @file validation.ts
 * @description Centralized request payload validator middleware.
 */

import type { Request, Response, NextFunction } from 'express';

export function validateBody(requiredFields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = requiredFields.filter((field) => {
      const val = req.body[field];
      return val === undefined || val === null || val === '';
    });

    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        error: `Missing required fields: ${missing.join(', ')}`,
      });
      return;
    }

    next();
  };
}
