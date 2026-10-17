/**
 * @file inventoryController.ts
 * @description Real-time inventory adjustment and audit logging controller.
 */

import type { Response } from 'express';
import { db} from '../db/database.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { ApiResponse } from '../types/api.ts';

export const inventoryController = {
  getAdjustments: (_req: AuthenticatedRequest, res: Response): void => {
    try {
      const logs = db.getInventoryAdjustments();
      const response: ApiResponse = {
        success: true,
        data: logs,
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to retrieve inventory logs' });
    }
  },

  adjustStock: (req: AuthenticatedRequest, res: Response): void => {
    try {
      const { productId, quantityChanged, reason } = req.body;

      if (!productId || quantityChanged === undefined || !reason) {
        res.status(400).json({
          success: false,
          error: 'productId, quantityChanged, and reason are required',
        });
        return;
      }

      const adminName = req.user?.name || 'Administrator';

      const updated = db.adjustStock(productId, Number(quantityChanged), reason, adminName);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      res.json({
        success: true,
        data: updated,
        message: 'Stock adjusted successfully and audit logged',
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to adjust stock' });
    }
  },
};
