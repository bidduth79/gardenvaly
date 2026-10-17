/**
 * @file reportsController.ts
 * @description Dashboard metrics, sales trends, top-selling products, and inventory alert controllers.
 */

import type { Request, Response } from 'express';
import { db} from '../db/database.ts';
import type { ApiResponse } from '../types/api.ts';

export const reportsController = {
  getDashboardMetrics: (req: Request, res: Response): void => {
    try {
      const { range, customStart, customEnd } = req.query;
      const metrics = db.getDashboardMetrics(
        typeof range === 'string' ? range : 'all_time',
        typeof customStart === 'string' ? customStart : undefined,
        typeof customEnd === 'string' ? customEnd : undefined
      );

      const response: ApiResponse = {
        success: true,
        data: metrics,
      };
      res.json(response);
    } catch {
      res.status(500).json({ success: false, error: 'Failed to calculate dashboard metrics' });
    }
  },

  getSalesTrend: (req: Request, res: Response): void => {
    try {
      const { range } = req.query;
      const trend = db.getSalesTrend(typeof range === 'string' ? range : 'last_30_days');
      res.json({
        success: true,
        data: trend,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to calculate sales trend' });
    }
  },

  getStatusDistribution: (req: Request, res: Response): void => {
    try {
      const { range } = req.query;
      const distribution = db.getStatusDistribution(typeof range === 'string' ? range : 'all_time');
      res.json({
        success: true,
        data: distribution,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to calculate status distribution' });
    }
  },

  getTopSellingProducts: (req: Request, res: Response): void => {
    try {
      const { range, category, limit } = req.query;
      const topProducts = db.getTopSellingProducts(
        typeof range === 'string' ? range : 'all_time',
        typeof category === 'string' ? category : undefined,
        limit ? parseInt(String(limit), 10) : 10
      );
      res.json({
        success: true,
        data: topProducts,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve top selling products' });
    }
  },

  getInventoryAlerts: (req: Request, res: Response): void => {
    try {
      const { threshold } = req.query;
      const alerts = db.getInventoryAlerts(threshold ? parseInt(String(threshold), 10) : 10);
      res.json({
        success: true,
        data: alerts,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve inventory alerts' });
    }
  },

  exportCsv: (req: Request, res: Response): void => {
    try {
      const { type, range } = req.query;
      const reportType = typeof type === 'string' ? type : 'summary';
      const selectedRange = typeof range === 'string' ? range : 'all_time';

      const csvContent = db.exportAnalyticsCsv(reportType, selectedRange);

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=gardenvaly-${reportType}-${selectedRange}-${Date.now()}.csv`
      );
      res.send(csvContent);
    } catch {
      res.status(500).json({ success: false, error: 'Failed to export analytics CSV' });
    }
  },
};
