/**
 * @file orderController.ts
 * @description Hardened order processing, complete 10-stage lifecycle transitions,
 * courier delivery management, Cash-on-Delivery reconciliation, and audit logs.
 */

import type { Request, Response } from 'express';
import { db} from '../db/database.ts';
import type { ApiResponse } from '../types/api.ts';
import { isValidTransition, type OrderStatus} from '../utils/orderLifecycle.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';

export const orderController = {
  getOrders: (req: Request, res: Response): void => {
    try {
      const {
        status,
        paymentStatus,
        paymentMethod,
        deliveryArea,
        startDate,
        endDate,
        search,
        sortBy,
        page,
        limit,
      } = req.query;

      const result = db.getOrders({
        status: typeof status === 'string' ? status : undefined,
        paymentStatus: typeof paymentStatus === 'string' ? paymentStatus : undefined,
        paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : undefined,
        deliveryArea: typeof deliveryArea === 'string' ? deliveryArea : undefined,
        startDate: typeof startDate === 'string' ? startDate : undefined,
        endDate: typeof endDate === 'string' ? endDate : undefined,
        search: typeof search === 'string' ? search : undefined,
        sortBy: typeof sortBy === 'string' ? (sortBy as 'newest' | 'oldest' | 'highest_total' | 'lowest_total') : undefined,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 50,
      });

      const response: ApiResponse = {
        success: true,
        data: result.orders,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
          timestamp: new Date().toISOString(),
        },
      };

      res.json(response);
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
    }
  },

  getOrderById: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const order = db.getOrderById(id);

      if (!order) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      res.json({ success: true, data: order });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve order' });
    }
  },

  /**
   * Public Order Tracking Endpoint (IDOR Protected).
   */
  trackOrder: (req: Request, res: Response): void => {
    try {
      const { orderNumber, mobileNumber } = req.body;

      if (!orderNumber || !mobileNumber) {
        res.status(400).json({
          success: false,
          error: 'Both Order Number and Customer Mobile Number are required for tracking.',
        });
        return;
      }

      const order = db.getOrderById(orderNumber.trim());
      if (!order) {
        res.status(404).json({
          success: false,
          error: 'No order found matching the provided order number and phone credentials.',
        });
        return;
      }

      const cleanPhone = mobileNumber.replace(/\D/g, '').slice(-11);
      const orderPhone = order.customer.mobileNumber.replace(/\D/g, '').slice(-11);

      if (cleanPhone !== orderPhone) {
        res.status(403).json({
          success: false,
          error: 'Security verification failed: Mobile number does not match this order record.',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          deliveryMethod: order.deliveryMethod,
          deliveryProvider: order.deliveryProvider,
          trackingNumber: order.trackingNumber,
          dispatchDate: order.dispatchDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          actualDeliveryDate: order.actualDeliveryDate,
          items: order.items,
          subtotal: order.subtotal,
          deliveryCharge: order.deliveryCharge,
          totalAmount: order.totalAmount,
          customer: {
            fullName: order.customer.fullName,
            district: order.customer.district,
            division: order.customer.division,
          },
          statusHistory: order.statusHistory,
          createdAt: order.createdAt,
        },
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to track order' });
    }
  },

  createOrder: (req: Request, res: Response): void => {
    try {
      const { customer, items, deliveryMethod, paymentMethod, adminNotes } = req.body;

      if (!customer || !customer.fullName || !customer.mobileNumber || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Customer name, 11-digit mobile number, and valid order items are strictly required.',
        });
        return;
      }

      const phoneDigits = customer.mobileNumber.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        res.status(400).json({
          success: false,
          error: 'Please provide a valid 11-digit Bangladeshi mobile number.',
        });
        return;
      }

      let verifiedSubtotal = 0;
      const verifiedItems = [];

      for (const item of items) {
        const qty = parseInt(String(item.quantity), 10);
        if (isNaN(qty) || qty <= 0) {
          res.status(400).json({
            success: false,
            error: `Invalid quantity for item: ${item.productId || 'unknown'}`,
          });
          return;
        }

        const product = db.getProductById(item.productId);
        if (!product) {
          res.status(400).json({
            success: false,
            error: `Product not found or unavailable: ${item.productId}`,
          });
          return;
        }

        if (product.isPublished === false) {
          res.status(400).json({
            success: false,
            error: `Product is currently unavailable: ${product.nameEn}`,
          });
          return;
        }

        if (product.stockQuantity < qty) {
          res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.nameEn}. Available stock: ${product.stockQuantity}, Requested: ${qty}`,
          });
          return;
        }

        const serverUnitPrice = product.price;
        const lineSubtotal = serverUnitPrice * qty;
        verifiedSubtotal += lineSubtotal;

        verifiedItems.push({
          productId: product.id,
          productName: product.nameEn,
          slug: product.slug,
          imageUrl: product.imageUrl,
          quantity: qty,
          unitPrice: serverUnitPrice,
          lineSubtotal,
        });
      }

      const isInsideDhaka =
        customer.division?.toLowerCase().includes('dhaka') ||
        customer.district?.toLowerCase().includes('dhaka');
      const verifiedDeliveryCharge = isInsideDhaka ? 60 : 120;
      const verifiedTotalAmount = verifiedSubtotal + verifiedDeliveryCharge;

      const safePaymentMethod = paymentMethod === 'online-bkash' ? 'online-bkash' : 'cash-on-delivery';

      const newOrder = db.createOrder({
        customer: {
          fullName: customer.fullName.trim(),
          mobileNumber: customer.mobileNumber.trim(),
          email: customer.email ? customer.email.trim() : undefined,
          division: customer.division || (isInsideDhaka ? 'Dhaka' : 'Outside Dhaka'),
          district: customer.district || (isInsideDhaka ? 'Dhaka' : 'Outside Dhaka'),
          upazila: customer.upazila || '',
          addressDetail: customer.addressDetail || '',
          deliveryInstructions: customer.deliveryInstructions || '',
        },
        items: verifiedItems,
        subtotal: verifiedSubtotal,
        deliveryCharge: verifiedDeliveryCharge,
        discountAmount: 0,
        totalAmount: verifiedTotalAmount,
        deliveryMethod: deliveryMethod || 'home-delivery',
        paymentMethod: safePaymentMethod,
        adminNotes,
      });

      res.status(201).json({
        success: true,
        data: newOrder,
        message: 'Order created and verified successfully.',
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to create order' });
    }
  },

  updateStatus: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      const existingOrder = db.getOrderById(id);
      if (!existingOrder) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      // Transition matrix validation
      const targetStatus = status as OrderStatus;
      const transitionCheck = isValidTransition(existingOrder.status, targetStatus, req.user?.role);
      if (!transitionCheck.allowed) {
        res.status(400).json({
          success: false,
          error: transitionCheck.reason || 'Invalid order status transition.',
        });
        return;
      }

      const performedBy = req.user?.name || 'Administrator';
      const result = db.updateOrderStatus(id, targetStatus, note, performedBy);

      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || 'Failed to update order status' });
        return;
      }

      res.json({
        success: true,
        data: result.order,
        message: `Order status changed from ${existingOrder.status} to ${targetStatus}`,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
  },

  updatePaymentStatus: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      const validPayments = ['unpaid', 'pending', 'paid', 'partially_refunded', 'refunded', 'failed'];
      if (!validPayments.includes(paymentStatus)) {
        res.status(400).json({
          success: false,
          error: `Invalid payment status. Must be one of: ${validPayments.join(', ')}`,
        });
        return;
      }

      const performedBy = req.user?.name || 'Administrator';
      const updated = db.updateOrderPaymentStatus(id, paymentStatus, performedBy);

      if (!updated) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      res.json({
        success: true,
        data: updated,
        message: `Payment status updated to ${paymentStatus}`,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update payment status' });
    }
  },

  updateDelivery: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const {
        deliveryProvider,
        trackingNumber,
        dispatchDate,
        expectedDeliveryDate,
        deliveryNotes,
      } = req.body;

      const performedBy = req.user?.name || 'Administrator';
      const updated = db.updateOrderDelivery(
        id,
        {
          deliveryProvider,
          trackingNumber,
          dispatchDate,
          expectedDeliveryDate,
          deliveryNotes,
        },
        performedBy
      );

      if (!updated) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      res.json({
        success: true,
        data: updated,
        message: 'Delivery and courier tracking details updated successfully',
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update delivery info' });
    }
  },

  recordCodCollection: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { collectedAmount, collectedByStaff, note } = req.body;

      const performedBy = req.user?.name || 'Administrator';
      const result = db.recordCodCollection(
        id,
        {
          collectedAmount: Number(collectedAmount),
          collectedByStaff: collectedByStaff || performedBy,
          note,
        },
        performedBy
      );

      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || 'Failed to record COD collection' });
        return;
      }

      res.json({
        success: true,
        data: result.order,
        message: 'COD payment collection verified and recorded in audit trail',
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to record COD collection' });
    }
  },

  processReturn: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { action, reason, returnedQuantities, restoreToStock } = req.body;

      if (!['request', 'approve', 'reject'].includes(action)) {
        res.status(400).json({ success: false, error: 'Action must be one of: request, approve, reject' });
        return;
      }

      const performedBy = req.user?.name || 'Administrator';
      const result = db.processOrderReturn(
        id,
        {
          action,
          reason,
          returnedQuantities,
          restoreToStock: Boolean(restoreToStock),
        },
        performedBy
      );

      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || 'Failed to process return' });
        return;
      }

      res.json({
        success: true,
        data: result.order,
        message: `Order return ${action} completed successfully`,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to process order return' });
    }
  },

  recordRefund: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;

      if (!amount || !reason) {
        res.status(400).json({ success: false, error: 'Refund amount and reason are required' });
        return;
      }

      const performedBy = req.user?.name || 'Administrator';
      const result = db.recordOrderRefund(
        id,
        {
          amount: Number(amount),
          reason,
        },
        performedBy
      );

      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || 'Failed to record refund' });
        return;
      }

      res.json({
        success: true,
        data: result.order,
        message: 'Refund recorded and reflected in order totals',
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to record refund' });
    }
  },

  exportCsv: (_req: AuthenticatedRequest, res: Response): void => {
    try {
      const { orders } = db.getOrders({ limit: 5000 });

      // CSV header
      const headers = [
        'Order Number',
        'Date',
        'Customer Name',
        'Mobile Number',
        'District',
        'Items Count',
        'Subtotal (BDT)',
        'Delivery Charge (BDT)',
        'Total Amount (BDT)',
        'Payment Method',
        'Payment Status',
        'Order Status',
        'Courier Provider',
        'Tracking Number',
        'COD Collected (BDT)',
      ];

      // Safe CSV formula injection escaping
      const escapeCell = (val: unknown): string => {
        let str = String(val ?? '').replace(/"/g, '""');
        // Prevent formula injection in Excel/Sheets (=, +, -, @)
        if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
          str = `'${str}`;
        }
        return `"${str}"`;
      };

      const rows = orders.map((o) => [
        escapeCell(o.orderNumber),
        escapeCell(new Date(o.createdAt).toLocaleDateString('en-GB')),
        escapeCell(o.customer.fullName),
        escapeCell(o.customer.mobileNumber),
        escapeCell(o.customer.district),
        escapeCell(o.items.length),
        escapeCell(o.subtotal),
        escapeCell(o.deliveryCharge),
        escapeCell(o.totalAmount),
        escapeCell(o.paymentMethod),
        escapeCell(o.paymentStatus),
        escapeCell(o.status),
        escapeCell(o.deliveryProvider || 'N/A'),
        escapeCell(o.trackingNumber || 'N/A'),
        escapeCell(o.codCollectedAmount || 0),
      ]);

      const csvContent = '\uFEFF' + [headers.map(escapeCell).join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=gardenvaly-orders-${Date.now()}.csv`);
      res.send(csvContent);
    } catch {
      res.status(500).json({ success: false, error: 'Failed to export orders' });
    }
  },
};
