/**
 * @file api.ts
 * @description Unified API response types and server-side data contracts.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    timestamp?: string;
  };
}

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'store_manager' | 'inventory_staff';
}
