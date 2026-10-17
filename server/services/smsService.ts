/**
 * @file smsService.ts
 * @description Bangladeshi SMS Gateway Service for Gardenvaly.
 * Supports Greenweb BD, BulkSMS BD, Generic Webhooks, and Development Simulation.
 */

import { db, DBOrder, DBStoreSettings } from '../db/database.ts';

export type SmsEvent = 'order_placed' | 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'custom' | 'otp';

export interface SmsSendResult {
  success: boolean;
  provider: string;
  recipient: string;
  message: string;
  response?: any;
  error?: string;
  simulated?: boolean;
}

export class SmsService {
  /**
   * Format Bangladeshi mobile number to standard international format (8801XXXXXXXXX)
   */
  public sanitizePhoneNumber(phone: string): string {
    let clean = phone.replace(/[^\d]/g, '');
    if (clean.startsWith('880')) return clean;
    if (clean.startsWith('01')) return '88' + clean;
    if (clean.startsWith('1') && clean.length === 10) return '880' + clean;
    return clean;
  }

  /**
   * Generate Bengali message templates
   */
  public generateTemplate(event: SmsEvent, data: { order?: DBOrder; settings?: DBStoreSettings; customText?: string }): string {
    const storeName = data.settings?.storeNameBn || 'গার্ডেনভ্যালি';
    const order = data.order;

    switch (event) {
      case 'order_placed':
        return `${storeName}: আপনার অর্ডার #${order?.orderNumber} সফলভাবে গ্রহণ করা হয়েছে। মোট: ৳${order?.totalAmount}। আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন।`;

      case 'order_confirmed':
        return `${storeName}: আপনার অর্ডার #${order?.orderNumber} নিশ্চিত করা হয়েছে। আপনার পছন্দের গাছ ও পণ্যসমূহ পরম যত্নে প্যাকেজিং করা হচ্ছে।`;

      case 'order_shipped': {
        const courier = order?.deliveryProvider || 'কুরিয়ার';
        const tracking = order?.trackingNumber ? ` ট্র্যাকিং নং: ${order.trackingNumber}।` : '';
        const url = order?.trackingUrl ? ` ট্র্যাক করুন: ${order.trackingUrl}` : '';
        return `${storeName}: আপনার অর্ডার #${order?.orderNumber} ${courier}-এ হ্যান্ডওভার করা হয়েছে।${tracking}${url} শীঘ্রই ডেলিভারি পাবেন।`;
      }

      case 'order_delivered':
        return `${storeName}: আপনার অর্ডার #${order?.orderNumber} সফলভাবে ডেলিভার্ড হয়েছে। আমাদের সাথে থাকার জন্য আন্তরিক ধন্যবাদ! সবুজে সাজুক আপনার জীবন।`;

      case 'custom':
      default:
        return data.customText || `${storeName}: আপনার অর্ডারের তথ্যের জন্য ধন্যবাদ।`;
    }
  }

  /**
   * Send an SMS using the store's configured gateway
   */
  public async sendSms(options: {
    to: string;
    message: string;
    event?: SmsEvent;
    orderId?: string;
  }): Promise<SmsSendResult> {
    const settings = db.getSettings();
    const recipient = this.sanitizePhoneNumber(options.to);
    const provider = settings.smsProvider || 'disabled';

    // Check if SMS is disabled or test simulation
    if (provider === 'disabled' || !settings.smsApiKey) {
      console.log(`[SMS-SIMULATOR] To: ${recipient} | Event: ${options.event || 'custom'} | Provider: ${provider}`);
      console.log(`[SMS-SIMULATOR] Message: "${options.message}"`);
      return {
        success: true,
        provider: 'simulator',
        recipient,
        message: options.message,
        simulated: true,
      };
    }

    try {
      if (provider === 'greenweb') {
        const url = new URL('https://api.greenweb.com.bd/api.php');
        url.searchParams.append('token', settings.smsApiKey);
        url.searchParams.append('to', recipient);
        url.searchParams.append('message', options.message);

        const res = await fetch(url.toString(), { method: 'GET' });
        const text = await res.text();

        return {
          success: !text.toLowerCase().includes('error'),
          provider: 'greenweb',
          recipient,
          message: options.message,
          response: text,
        };
      }

      if (provider === 'bulksmsbd') {
        const url = new URL('http://bulksmsbd.net/api/smsapi');
        url.searchParams.append('api_key', settings.smsApiKey);
        url.searchParams.append('type', 'text');
        url.searchParams.append('number', recipient);
        url.searchParams.append('senderid', settings.smsSenderId || 'Gardenvaly');
        url.searchParams.append('message', options.message);

        const res = await fetch(url.toString(), { method: 'POST' });
        const json = await res.json().catch(() => ({ raw: 'unparsed' }));

        return {
          success: res.ok,
          provider: 'bulksmsbd',
          recipient,
          message: options.message,
          response: json,
        };
      }

      if (provider === 'custom_webhook' && settings.smsWebhookUrl) {
        const res = await fetch(settings.smsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient,
            message: options.message,
            event: options.event,
            orderId: options.orderId,
            timestamp: new Date().toISOString(),
          }),
        });

        return {
          success: res.ok,
          provider: 'custom_webhook',
          recipient,
          message: options.message,
        };
      }

      return {
        success: true,
        provider: 'simulator',
        recipient,
        message: options.message,
        simulated: true,
      };
    } catch (err: any) {
      console.error('[SMS-GATEWAY-ERROR]', err);
      return {
        success: false,
        provider,
        recipient,
        message: options.message,
        error: err.message || 'Network error communicating with SMS gateway',
      };
    }
  }

  /**
   * Helper to trigger event-driven SMS based on store settings
   */
  public async triggerOrderSms(order: DBOrder, event: SmsEvent): Promise<SmsSendResult | null> {
    const settings = db.getSettings();

    // Check individual event toggles
    if (event === 'order_placed' && settings.sendSmsOnOrderPlaced === false) return null;
    if (event === 'order_confirmed' && settings.sendSmsOnOrderConfirmed === false) return null;
    if (event === 'order_shipped' && settings.sendSmsOnOrderShipped === false) return null;
    if (event === 'order_delivered' && settings.sendSmsOnOrderDelivered === false) return null;

    const message = this.generateTemplate(event, { order, settings });
    return this.sendSms({
      to: order.customer.mobileNumber,
      message,
      event,
      orderId: order.id,
    });
  }
}

export const smsService = new SmsService();
