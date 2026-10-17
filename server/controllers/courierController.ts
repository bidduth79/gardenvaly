/**
 * @file courierController.ts
 * @description Admin courier operations: parcel dispatch, tracking status, and gateway testing.
 */

import type { Request, Response } from 'express';
import { db } from '../db/database.ts';
import { courierService } from '../services/courierService.ts';

export const courierController = {
  /**
   * Dispatch an order parcel to courier (Steadfast, Pathao, RedX, or Simulator)
   */
  dispatchOrder: async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, provider, weightInKg, deliveryNotes } = req.body;

      if (!orderId) {
        res.status(400).json({ success: false, error: 'Order ID is required' });
        return;
      }

      const order = db.getOrderById(orderId);
      if (!order) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      const result = await courierService.executeOrderDispatch(order, {
        provider,
        weightInKg: Number(weightInKg) || 1,
        deliveryNotes,
      });

      if (result.success && result.order) {
        res.json({
          success: true,
          data: result.order,
          message: 'Parcel dispatched to courier successfully',
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error || 'Failed to dispatch to courier',
        });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Internal courier dispatch error' });
    }
  },

  /**
   * Test Courier Gateway connection
   */
  testCourier: async (req: Request, res: Response): Promise<void> => {
    try {
      const { provider } = req.body;
      const testResult = await courierService.dispatchParcel({
        orderId: `TEST-${Date.now()}`,
        provider: provider || 'steadfast',
        recipientName: 'Test Recipient',
        recipientPhone: '01700000000',
        recipientAddress: 'Dhanmondi 27, Dhaka',
        codAmount: 500,
        weightInKg: 0.5,
        deliveryNotes: 'Gardenvaly API Connection Test',
      });

      res.json({
        success: testResult.success,
        data: testResult,
        message: testResult.simulated
          ? 'Courier Simulator Mode is Active (Ready for API keys)'
          : 'Connected to Live Courier API successfully',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Courier test failed' });
    }
  },
};
