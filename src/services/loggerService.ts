/**
 * @file loggerService.ts
 * @description Centralized logging and error reporting service.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  context?: string;
  error?: Error | unknown;
  timestamp: string;
}

export const loggerService = {
  /**
   * Logs info level messages with execution context.
   */
  info(message: string, context: string = 'App'): void {
    const payload: LogPayload = {
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[${payload.timestamp}] [${context}] INFO:`, message);
    }
  },

  /**
   * Logs warning messages with context.
   */
  warn(message: string, context: string = 'App'): void {
    const payload: LogPayload = {
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    console.warn(`[${payload.timestamp}] [${context}] WARN:`, message);
  },

  /**
   * Safely captures and handles errors without crashing UI.
   */
  error(message: string, error?: unknown, context: string = 'App'): void {
    const payload: LogPayload = {
      message,
      context,
      error,
      timestamp: new Date().toISOString(),
    };
    console.error(`[${payload.timestamp}] [${context}] ERROR:`, message, error);
  },
};
