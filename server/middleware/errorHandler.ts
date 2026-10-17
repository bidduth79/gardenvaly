/**
 * @file errorHandler.ts
 * @description Centralized error handler and not-found router middleware with information leakage prevention.
 */

import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/api.ts';

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error internally without exposing it in the HTTP response
  console.error('[API Error]', err.name, err.message);

  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Prevent information leakage in production
  const safeErrorMessage = isProduction && statusCode === 500
    ? 'An internal server error occurred. Please contact Gardenvaly support.'
    : err.message || 'Internal Server Error';

  const response: ApiResponse = {
    success: false,
    error: safeErrorMessage,
  };

  res.status(statusCode).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
}
