/**
 * @file authRoutes.ts
 * @description Authentication routes with rate limiting and JWT validation.
 */

import { Router } from 'express';
import { authController} from '../controllers/authController.ts';
import { authenticateAdmin} from '../middleware/auth.ts';
import { authRateLimiter} from '../middleware/security.ts';

const router = Router();

// Login endpoint protected against brute force attacks
router.post('/login', authRateLimiter, authController.login);
router.get('/me', authenticateAdmin, authController.getCurrentUser);

export default router;
