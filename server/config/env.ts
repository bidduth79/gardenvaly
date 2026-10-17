/**
 * @file env.ts
 * @description Centralized environment configuration for Gardenvaly Express Backend.
 */

import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'gardenvaly_secret_jwt_key_2026',
  JWT_EXPIRES_IN: '7d',
  DATABASE_URL: process.env.DATABASE_URL || '',
  IS_PROD: process.env.NODE_ENV === 'production',
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || '',
  GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID || '',
};
