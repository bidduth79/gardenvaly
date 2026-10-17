/**
 * @file integrationService.ts
 * @description Frontend client service for Courier (Steadfast/Pathao/RedX), SMS Gateway,
 * and Online Payment Gateways (bKash Checkout / SSLCommerz).
 */

import { apiClient, ApiResponse } from './apiClient';
import { AdminOrder } from '../types/order';

export interface CourierDispatchResult {
  success: boolean;
  provider: string;
  trackingNumber: string;
  trackingUrl: string;
  consignmentId?: string;
  simulated?: boolean;
}

export interface SmsSendResult {
  success: boolean;
  provider: string;
  recipient: string;
  message: string;
  simulated?: boolean;
}

export interface PaymentInitResponse {
  success: boolean;
  paymentMethod: 'bkash-online' | 'sslcommerz';
  redirectUrl?: string;
  paymentId?: string;
  transactionId?: string;
  simulated?: boolean;
  message?: string;
}

export const integrationService = {
  /**
   * Dispatches parcel to Steadfast, Pathao, or RedX
   */
  async dispatchCourier(payload: {
    orderId: string;
    provider?: string;
    weightInKg?: number;
    deliveryNotes?: string;
  }): Promise<ApiResponse<AdminOrder>> {
    return apiClient.post<AdminOrder>('/courier/dispatch', payload);
  },

  /**
   * Tests courier gateway credentials
   */
  async testCourier(provider: string): Promise<ApiResponse<any>> {
    return apiClient.post('/courier/test', { provider });
  },

  /**
   * Sends manual or template SMS to a customer
   */
  async sendSms(payload: {
    to: string;
    message: string;
    orderId?: string;
    event?: string;
  }): Promise<ApiResponse<SmsSendResult>> {
    return apiClient.post<SmsSendResult>('/sms/send', payload);
  },

  /**
   * Tests SMS gateway connectivity
   */
  async testSms(testPhone: string): Promise<ApiResponse<any>> {
    return apiClient.post('/sms/test', { testPhone });
  },

  /**
   * Initiates online bKash or SSLCommerz payment
   */
  async initiatePayment(orderId: string, method: 'bkash-online' | 'sslcommerz'): Promise<ApiResponse<PaymentInitResponse>> {
    return apiClient.post<PaymentInitResponse>('/payments/init', { orderId, method });
  },

  /**
   * Verifies and marks an online payment as completed
   */
  async verifyPayment(orderId: string, transactionId: string, method: string): Promise<ApiResponse<AdminOrder>> {
    return apiClient.post<AdminOrder>('/payments/verify', { orderId, transactionId, method });
  },
};
