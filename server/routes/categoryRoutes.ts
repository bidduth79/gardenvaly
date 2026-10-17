/**
 * @file categoryRoutes.ts
 * @description Category routes.
 */

import { Router } from 'express';
import { categoryController} from '../controllers/categoryController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';

const router = Router();

// Public read
router.get('/', categoryController.getCategories);

// Admin write
router.post('/', authenticateAdmin, categoryController.createCategory);
router.put('/:id', authenticateAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateAdmin, categoryController.deleteCategory);

export default router;
