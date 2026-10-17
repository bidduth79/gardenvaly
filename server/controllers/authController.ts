/**
 * @file authController.ts
 * @description Hardened authentication controller for Gardenvaly administrative users.
 * Protects against timing attacks, username enumeration, and credential leakage.
 */

import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV} from '../config/env.ts';
import { db} from '../db/database.ts';
import type { AuthenticatedRequest } from '../middleware/auth.ts';
import type { ApiResponse } from '../types/api.ts';

// Pre-computed dummy hash to prevent timing attacks when an email does not exist
const DUMMY_HASH = '$2a$10$wN3f3V6V6m3GZfP3nF9C7.eXU6Q4x7I0hF9F1aZ9rO.pM8WkKzJm.';

export const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      const trimmedEmail = email.trim().toLowerCase();
      const user = db.findUserByEmail(trimmedEmail);

      // Defend against timing attacks: Always execute bcrypt.compare
      const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
      const isMatch = await bcrypt.compare(password, hashToCompare);

      if (!user || !isMatch) {
        // Uniform message against user enumeration
        res.status(401).json({
          success: false,
          error: 'Invalid email or password combination.',
        });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: 'Your administrator account has been deactivated. Please contact Hasna Hena.',
        });
        return;
      }

      db.updateUserLastLogin(user.id);

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const signOptions: jwt.SignOptions = {
        expiresIn: '7d',
      };

      const token = jwt.sign(payload, ENV.JWT_SECRET, signOptions);

      const response: ApiResponse = {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            lastLogin: new Date().toISOString(),
          },
        },
        message: 'Login successful',
      };

      res.json(response);
    } catch {
      res.status(500).json({
        success: false,
        error: 'An unexpected authentication error occurred',
      });
    }
  },

  getCurrentUser: (req: AuthenticatedRequest, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = db.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    // Always sanitize user object (never return passwordHash)
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    });
  },
};
