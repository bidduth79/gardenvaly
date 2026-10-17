/**
 * @file paymentController.ts
 * @description Online payment gateway controllers for bKash Checkout and SSLCommerz.
 */

import type { Request, Response } from 'express';
import { db } from '../db/database.ts';
import { paymentService } from '../services/paymentService.ts';

export const paymentController = {
  /**
   * Initiate Online Payment for an order
   */
  initiatePayment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, method } = req.body;

      if (!orderId) {
        res.status(400).json({ success: false, error: 'Order ID is required' });
        return;
      }

      const order = db.getOrderById(orderId);
      if (!order) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      const origin = `${req.protocol}://${req.get('host')}`;

      if (method === 'sslcommerz') {
        const result = await paymentService.initSslcommerzPayment(order, origin);
        res.json({ success: true, data: result });
        return;
      }

      // Default: bKash online merchant checkout
      const result = await paymentService.initBkashPayment(order);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Payment initiation failed' });
    }
  },

  /**
   * Verify and finalize payment
   */
  verifyPayment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, transactionId, method } = req.body;

      if (!orderId || !transactionId) {
        res.status(400).json({ success: false, error: 'Order ID and Transaction ID are required' });
        return;
      }

      const finalized = await paymentService.finalizeSuccessfulPayment(orderId, transactionId, method || 'online');
      if (finalized) {
        const order = db.getOrderById(orderId);
        res.json({
          success: true,
          data: order,
          message: 'Payment verified and order status updated to Paid',
        });
      } else {
        res.status(400).json({ success: false, error: 'Failed to verify payment record' });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Payment verification failed' });
    }
  },
};
