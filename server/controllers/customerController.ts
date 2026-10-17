/**
 * @file customerController.ts
 * @description Customer authentication, profile management, order history, and wishlist controller.
 */

import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.ts';
import { ENV } from '../config/env.ts';
import type { ApiResponse } from '../types/api.ts';
import type { AuthenticatedCustomerRequest } from '../middleware/auth.ts';

const DUMMY_HASH = '$2a$10$wN3f3V6V6m3GZfP3nF9C7.eXU6Q4x7I0hF9F1aZ9rO.pM8WkKzJm.';

export const customerController = {
  // ADMIN ACTIONS
  getCustomers: (_req: Request, res: Response): void => {
    try {
      const customers = db.getCustomers().map((c) => {
        // Sanitize password hash before returning
        const { passwordHash: _, ...rest } = c;
        return rest;
      });
      const response: ApiResponse = {
        success: true,
        data: customers,
        meta: { total: customers.length },
      };
      res.json(response);
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve customers' });
    }
  },

  getCustomerById: (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const customer = db.getCustomerById(id);
      if (!customer) {
        res.status(404).json({ success: false, error: 'Customer not found' });
        return;
      }
      const { passwordHash: _, ...sanitized } = customer;
      res.json({ success: true, data: sanitized });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve customer' });
    }
  },

  // CUSTOMER AUTH & DASHBOARD
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullName, mobileNumber, email, password, division, district, upazila, addressDetail } = req.body;

      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        res.status(400).json({ success: false, error: 'আপনার পুরো নাম আবশ্যক (কমপক্ষে ২ অক্ষর)' });
        return;
      }

      if (!mobileNumber || typeof mobileNumber !== 'string') {
        res.status(400).json({ success: false, error: 'সঠিক মোবাইল নম্বর প্রদান করুন' });
        return;
      }

      const cleanPhone = mobileNumber.replace(/\D/g, '');
      if (cleanPhone.length < 11) {
        res.status(400).json({ success: false, error: '১১ ডিজিটের সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)' });
        return;
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        res.status(400).json({ success: false, error: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' });
        return;
      }

      // Check if phone or email already registered
      const existingPhone = db.findCustomerByMobile(cleanPhone);
      if (existingPhone && existingPhone.passwordHash) {
        res.status(409).json({ success: false, error: 'এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি একাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      let customer;
      if (existingPhone) {
        // If customer was created via previous order without password, update with credentials
        customer = db.updateCustomer(existingPhone.id, {
          fullName: fullName.trim(),
          email: email?.trim() || existingPhone.email,
          passwordHash,
          division: division || existingPhone.division,
          district: district || existingPhone.district,
          upazila: upazila || existingPhone.upazila,
          addressDetail: addressDetail || existingPhone.addressDetail,
        });
      } else {
        customer = db.registerCustomer({
          fullName: fullName.trim(),
          mobileNumber: cleanPhone,
          email: email?.trim(),
          passwordHash,
          division: division?.trim() || 'Dhaka',
          district: district?.trim() || 'Dhaka',
          upazila: upazila?.trim() || '',
          addressDetail: addressDetail?.trim() || '',
        });
      }

      if (!customer) {
        res.status(500).json({ success: false, error: 'Failed to create customer account' });
        return;
      }

      const token = jwt.sign(
        {
          id: customer.id,
          fullName: customer.fullName,
          mobileNumber: customer.mobileNumber,
          email: customer.email,
        },
        ENV.JWT_SECRET,
        { expiresIn: '30d' }
      );

      const { passwordHash: _, ...sanitized } = customer;

      res.status(201).json({
        success: true,
        message: 'একাউন্ট সফলভাবে তৈরি হয়েছে!',
        data: {
          token,
          customer: sanitized,
        },
      });
    } catch {
      res.status(500).json({ success: false, error: 'Registration failed unexpectedly' });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { identifier, password, isDemo } = req.body;

      // Fast-track demo login convenience for Tahmina Akter
      if (isDemo) {
        const demoCust = db.findCustomerByMobile('01712345678') || db.getCustomers()[0];
        if (demoCust) {
          const token = jwt.sign(
            {
              id: demoCust.id,
              fullName: demoCust.fullName,
              mobileNumber: demoCust.mobileNumber,
              email: demoCust.email,
            },
            ENV.JWT_SECRET,
            { expiresIn: '30d' }
          );
          const { passwordHash: _, ...sanitized } = demoCust;
          res.json({
            success: true,
            message: 'ডেমো একাউন্টে সফলভাবে লগইন হয়েছে',
            data: { token, customer: sanitized },
          });
          return;
        }
      }

      if (!identifier || !password) {
        res.status(400).json({ success: false, error: 'মোবাইল নম্বর/ইমেইল এবং পাসওয়ার্ড আবশ্যক' });
        return;
      }

      const customer = db.findCustomerByIdentifier(String(identifier));
      const hashToCompare = customer?.passwordHash || DUMMY_HASH;
      const isMatch = await bcrypt.compare(String(password), hashToCompare);

      if (!customer || !isMatch) {
        res.status(401).json({ success: false, error: 'মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।' });
        return;
      }

      const token = jwt.sign(
        {
          id: customer.id,
          fullName: customer.fullName,
          mobileNumber: customer.mobileNumber,
          email: customer.email,
        },
        ENV.JWT_SECRET,
        { expiresIn: '30d' }
      );

      const { passwordHash: _, ...sanitized } = customer;

      res.json({
        success: true,
        message: 'স্বাগতম! সফলভাবে লগইন হয়েছে',
        data: {
          token,
          customer: sanitized,
        },
      });
    } catch {
      res.status(500).json({ success: false, error: 'Authentication error' });
    }
  },

  getProfile: (req: AuthenticatedCustomerRequest, res: Response): void => {
    try {
      if (!req.customer) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const customer = db.getCustomerById(req.customer.id);
      if (!customer) {
        res.status(404).json({ success: false, error: 'Customer not found' });
        return;
      }

      const { passwordHash: _, ...sanitized } = customer;
      const orders = db.getCustomerOrders(customer.mobileNumber);

      res.json({
        success: true,
        data: {
          ...sanitized,
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
        },
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to retrieve profile' });
    }
  },

  updateProfile: (req: AuthenticatedCustomerRequest, res: Response): void => {
    try {
      if (!req.customer) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { fullName, email, division, district, upazila, addressDetail } = req.body;

      const updated = db.updateCustomer(req.customer.id, {
        fullName: typeof fullName === 'string' ? fullName.trim() : undefined,
        email: typeof email === 'string' ? email.trim() : undefined,
        division: typeof division === 'string' ? division.trim() : undefined,
        district: typeof district === 'string' ? district.trim() : undefined,
        upazila: typeof upazila === 'string' ? upazila.trim() : undefined,
        addressDetail: typeof addressDetail === 'string' ? addressDetail.trim() : undefined,
      });

      if (!updated) {
        res.status(404).json({ success: false, error: 'Customer not found' });
        return;
      }

      const { passwordHash: _, ...sanitized } = updated;
      res.json({
        success: true,
        message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে',
        data: sanitized,
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
  },

  getMyOrders: (req: AuthenticatedCustomerRequest, res: Response): void => {
    try {
      if (!req.customer) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const orders = db.getCustomerOrders(req.customer.mobileNumber);
      res.json({
        success: true,
        data: orders,
        meta: { total: orders.length },
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to fetch customer orders' });
    }
  },

  toggleWishlist: (req: AuthenticatedCustomerRequest, res: Response): void => {
    try {
      if (!req.customer) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const { productId } = req.body;
      if (!productId || typeof productId !== 'string') {
        res.status(400).json({ success: false, error: 'Product ID is required' });
        return;
      }

      const updatedWishlist = db.toggleCustomerWishlist(req.customer.id, productId);
      res.json({
        success: true,
        data: {
          wishlist: updatedWishlist,
          isWishlisted: updatedWishlist.includes(productId),
        },
      });
    } catch {
      res.status(500).json({ success: false, error: 'Failed to update wishlist' });
    }
  },
};
