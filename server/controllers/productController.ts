/**
 * @file productController.ts
 * @description Product catalog and inventory management controller.
 */

import type { Request, Response } from 'express';
import { db} from '../db/database.ts';
import type { ApiResponse } from '../types/api.ts';

export const productController = {
  getProducts: (req: Request, res: Response): void => {
    try {
      const { category, type, search, inStock, publishedOnly } = req.query;

      const products = db.getProducts({
        category: typeof category === 'string' ? category : undefined,
        type: typeof type === 'string' ? type : undefined,
        search: typeof search === 'string' ? search : undefined,
        inStockOnly: inStock === 'true',
        publishedOnly: publishedOnly !== 'false',
      });

      const response: ApiResponse = {
        success: true,
        data: products,
        meta: {
          total: products.length,
          timestamp: new Date().toISOString(),
        },
      };

      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to retrieve products' });
    }
  },

  getProductById: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const product = db.getProductById(id);

      if (!product) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to retrieve product' });
    }
  },

  createProduct: (req: Request, res: Response): void => {
    try {
      const {
        nameEn,
        nameBn,
        type,
        category,
        categorySlug,
        price,
        SKU,
        stockQuantity,
        imageUrl,
      } = req.body;

      if (!nameEn || !nameBn || !type || !price || !SKU) {
        res.status(400).json({
          success: false,
          error: 'Required fields: nameEn, nameBn, type, price, SKU',
        });
        return;
      }

      const slug = (req.body.slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '');

      const newProduct = db.createProduct({
        slug,
        SKU,
        type,
        category: category || 'Plants',
        categorySlug: categorySlug || 'indoor-plants',
        nameEn,
        nameBn,
        botanicalName: req.body.botanicalName || '',
        descriptionEn: req.body.descriptionEn || '',
        descriptionBn: req.body.descriptionBn || '',
        price: Number(price),
        originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : undefined,
        discountPercent: req.body.discountPercent ? Number(req.body.discountPercent) : 0,
        stockQuantity: Number(stockQuantity) || 0,
        inStock: Number(stockQuantity) > 0,
        isFeatured: Boolean(req.body.isFeatured),
        isBestseller: Boolean(req.body.isBestseller),
        isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
        rating: 5.0,
        reviewsCount: 0,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800',
        images: req.body.images || [imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'],
        indoorOutdoor: req.body.indoorOutdoor || 'both',
        packetSizeEn: req.body.packetSizeEn,
        packetSizeBn: req.body.packetSizeBn,
        plantHeightEn: req.body.plantHeightEn,
        plantHeightBn: req.body.plantHeightBn,
        plantAgeEn: req.body.plantAgeEn,
        plantAgeBn: req.body.plantAgeBn,
        sunlightEn: req.body.sunlightEn || 'Indirect light',
        sunlightBn: req.body.sunlightBn || 'পরোক্ষ আলো',
        waterEn: req.body.waterEn || 'Regular moisture',
        waterBn: req.body.waterBn || 'পরিমিত জল',
        soilTypeEn: req.body.soilTypeEn,
        soilTypeBn: req.body.soilTypeBn,
        plantingSeasonEn: req.body.plantingSeasonEn,
        plantingSeasonBn: req.body.plantingSeasonBn,
        tagsEn: req.body.tagsEn || [],
        tagsBn: req.body.tagsBn || [],
      });

      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'Product created successfully',
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to create product' });
    }
  },

  updateProduct: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const updated = db.updateProduct(id, req.body);

      if (!updated) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      res.json({
        success: true,
        data: updated,
        message: 'Product updated successfully',
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  },

  deleteProduct: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const success = db.deleteProduct(id);

      if (!success) {
        res.status(404).json({ success: false, error: 'Product not found' });
        return;
      }

      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  },
};
