/**
 * @file customer.ts
 * @description Customer authentication, profile, and dashboard type definitions.
 */

import { Order } from './order';

export interface CustomerProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  email?: string;
  division: string;
  district: string;
  upazila?: string;
  union?: string;
  addressDetail: string;
  wishlist?: string[];
  totalOrders: number;
  totalSpent: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAuthResponse {
  token: string;
  customer: CustomerProfile;
}

export interface CustomerLoginPayload {
  identifier: string;
  password?: string;
  isDemo?: boolean;
}

export interface CustomerRegisterPayload {
  fullName: string;
  mobileNumber: string;
  email?: string;
  password: string;
  division?: string;
  district?: string;
  upazila?: string;
  union?: string;
  addressDetail?: string;
}
