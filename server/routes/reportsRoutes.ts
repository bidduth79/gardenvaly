/**
 * @file reportsRoutes.ts
 * @description Secure administrative reporting and analytics routes.
 */

import { Router } from 'express';
import { reportsController} from '../controllers/reportsController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';

const router = Router();

// Dashboard & Analytics endpoints (protected by authenticateAdmin)
router.get('/dashboard', authenticateAdmin, reportsController.getDashboardMetrics);
router.get('/metrics', authenticateAdmin, reportsController.getDashboardMetrics);
router.get('/sales-trend', authenticateAdmin, reportsController.getSalesTrend);
router.get('/status-distribution', authenticateAdmin, reportsController.getStatusDistribution);
router.get('/top-products', authenticateAdmin, reportsController.getTopSellingProducts);
router.get('/inventory-alerts', authenticateAdmin, reportsController.getInventoryAlerts);
router.get('/export/csv', authenticateAdmin, reportsController.exportCsv);

// Default endpoint fallback
router.get('/', authenticateAdmin, reportsController.getDashboardMetrics);

export default router;
