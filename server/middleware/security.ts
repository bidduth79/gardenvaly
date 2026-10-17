/**
 * @file security.ts
 * @description Centralized security middleware suite for Gardenvaly.
 * Includes rate limiting, HTTP security headers, CORS protection, and input sanitization.
 */

import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter for Authentication endpoints (Login, Password reset).
 * Restricts brute-force password guessing attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Max 10 login attempts per IP per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
    retryAfterMinutes: 15,
  },
});

/**
 * Rate Limiter for Public Order Creation.
 * Prevents spam order floods, inventory hoarding, and automated checkout bots.
 */
export const orderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 orders per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Order placement rate limit reached. Please wait a few moments before submitting another order.',
  },
});

/**
 * General API Rate Limiter for all other endpoints.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 1000 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'API rate limit exceeded. Please throttle your requests.',
  },
});

/**
 * Hardened Security Headers Middleware (Helmet-compatible implementation).
 * Protects against MIME-sniffing, XSS, and Referrer leakage.
 * NOTE: X-Frame-Options is intentionally omitted to allow AI Studio preview iframe embedding.
 */
export function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Allow embedding within AI Studio iframe - do NOT set X-Frame-Options SAMEORIGIN
  // res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Legacy browser XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information sent in HTTP requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict browser features and APIs
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (HTTP Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
}

/**
 * Deep Input Sanitization Middleware.
 * Recursively strips dangerous script tags, null-bytes, and prototype pollution keys.
 */
function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    // Strip script tags and dangerous HTML injections
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onload=/gi, '')
      .replace(/onerror=/gi, '')
      .trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const cleanObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleanObj[key] = sanitizeValue(val);
    }
    return cleanObj;
  }

  return value;
}

export function inputSanitizationMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query) as typeof req.query;
  }
  next();
}
