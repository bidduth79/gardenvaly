/**
 * @file index.ts
 * @description Master router combining all Gardenvaly REST API endpoints.
 */

import { Router } from 'express';
import authRoutes from './authRoutes.ts';
import productRoutes from './productRoutes.ts';
import categoryRoutes from './categoryRoutes.ts';
import orderRoutes from './orderRoutes.ts';
import inventoryRoutes from './inventoryRoutes.ts';
import customerRoutes from './customerRoutes.ts';
import settingsRoutes from './settingsRoutes.ts';
import reportsRoutes from './reportsRoutes.ts';
import courierRoutes from './courierRoutes.ts';
import smsRoutes from './smsRoutes.ts';
import paymentRoutes from './paymentRoutes.ts';
import { ENV } from '../config/env.ts';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Gardenvaly API is running smoothly',
    brand: 'Gardenvaly by Hasna Hena',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Mounted sub-routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/inventory', inventoryRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/reports', reportsRoutes);
apiRouter.use('/courier', courierRoutes);
apiRouter.use('/sms', smsRoutes);
apiRouter.use('/payments', paymentRoutes);

// 404 handler for unknown API routes
apiRouter.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

export default apiRouter;
