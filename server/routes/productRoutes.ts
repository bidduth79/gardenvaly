/**
 * @file productRoutes.ts
 * @description Product catalog routes.
 */

import { Router } from 'express';
import { productController} from '../controllers/productController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';

const router = Router();

// Public read routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin write routes
router.post('/', authenticateAdmin, productController.createProduct);
router.put('/:id', authenticateAdmin, productController.updateProduct);
router.delete('/:id', authenticateAdmin, productController.deleteProduct);

export default router;
