/**
 * @file smsController.ts
 * @description Admin SMS operations: sending manual/custom SMS and testing gateway connection.
 */

import type { Request, Response } from 'express';
import { smsService } from '../services/smsService.ts';

export const smsController = {
  /**
   * Send custom or template SMS
   */
  sendSms: async (req: Request, res: Response): Promise<void> => {
    try {
      const { to, message, event, orderId } = req.body;

      if (!to || !message) {
        res.status(400).json({ success: false, error: 'Recipient phone number and message text are required' });
        return;
      }

      const result = await smsService.sendSms({
        to,
        message,
        event: event || 'custom',
        orderId,
      });

      res.json({
        success: result.success,
        data: result,
        message: result.simulated
          ? 'SMS logged in development console (Add API Key to send real SMS)'
          : 'SMS sent to gateway successfully',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to send SMS' });
    }
  },

  /**
   * Test SMS Gateway connection
   */
  testSms: async (req: Request, res: Response): Promise<void> => {
    try {
      const { testPhone } = req.body;
      const targetPhone = testPhone || '01700000000';

      const result = await smsService.sendSms({
        to: targetPhone,
        message: 'গার্ডেনভ্যালি: আপনার এসএমএস গেটওয়ে সফলভাবে কনফিগার করা হয়েছে!',
        event: 'custom',
      });

      res.json({
        success: result.success,
        data: result,
        message: result.simulated
          ? 'SMS Gateway is in Simulation Mode (Enter your API Key in Settings to go live)'
          : `Test SMS successfully dispatched to ${targetPhone}`,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Test SMS failed' });
    }
  },
};
