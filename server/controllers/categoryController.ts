/**
 * @file categoryController.ts
 * @description Category catalog controller for plant and seed classifications.
 */

import type { Request, Response } from 'express';
import { db} from '../db/database.ts';
import type { ApiResponse } from '../types/api.ts';

export const categoryController = {
  getCategories: (_req: Request, res: Response): void => {
    try {
      const categories = db.getCategories();
      const response: ApiResponse = {
        success: true,
        data: categories,
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to retrieve categories' });
    }
  },

  createCategory: (req: Request, res: Response): void => {
    try {
      const { nameEn, nameBn, type, descriptionEn, descriptionBn, imageUrl } = req.body;

      if (!nameEn || !nameBn || !type) {
        res.status(400).json({ success: false, error: 'nameEn, nameBn, and type are required' });
        return;
      }

      const slug = (req.body.slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

      const newCat = db.createCategory({
        slug,
        type,
        nameEn,
        nameBn,
        descriptionEn: descriptionEn || '',
        descriptionBn: descriptionBn || '',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800',
        isActive: true,
        itemCount: 0,
      });

      res.status(201).json({ success: true, data: newCat, message: 'Category created' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to create category' });
    }
  },

  updateCategory: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const updated = db.updateCategory(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
      }
      res.json({ success: true, data: updated, message: 'Category updated' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to update category' });
    }
  },

  deleteCategory: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const deleted = db.deleteCategory(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
      }
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to delete category' });
    }
  },
};
