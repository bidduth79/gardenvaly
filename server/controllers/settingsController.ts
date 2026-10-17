/**
 * @file settingsController.ts
 * @description Store settings controller for delivery fees, contacts, and store policies.
 */

import type { Request, Response } from 'express';
import { db} from '../db/database.ts';
import type { ApiResponse } from '../types/api.ts';

export const settingsController = {
  getSettings: (_req: Request, res: Response): void => {
    try {
      const settings = db.getSettings();
      const response: ApiResponse = {
        success: true,
        data: settings,
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to retrieve settings' });
    }
  },

  updateSettings: (req: Request, res: Response): void => {
    try {
      const updated = db.updateSettings(req.body);
      res.json({
        success: true,
        data: updated,
        message: 'Store settings updated successfully',
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
  },
};
