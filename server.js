// server.ts
import express from "express";
import cors from "cors";
import path2 from "path";
import { fileURLToPath } from "url";

// server/routes/index.ts
import { Router as Router9 } from "express";

// server/routes/authRoutes.ts
import { Router } from "express";

// server/controllers/authController.ts
import bcrypt2 from "bcryptjs";
import jwt from "jsonwebtoken";

// server/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var ENV = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "gardenvaly_secret_jwt_key_2026",
  JWT_EXPIRES_IN: "7d",
  DATABASE_URL: process.env.DATABASE_URL || "",
  IS_PROD: process.env.NODE_ENV === "production",
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION || "",
  GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID || ""
};

// server/db/database.ts
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
var DATA_DIR = path.resolve(process.cwd(), "server", "data");
var DATA_FILE = path.join(DATA_DIR, "store.json");
var DatabaseService = class {
  constructor() {
    this.init();
  }
  init() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {
      }
    }
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        this.data = JSON.parse(raw);
        return;
      } catch (err) {
        console.warn("[DB] Failed to read existing store.json, re-seeding default data", err);
      }
    }
    this.seedDefaultData();
    this.persist();
  }
  seedDefaultData() {
    const salt = bcrypt.genSaltSync(10);
    const demoAdminHash = bcrypt.hashSync("gardenvaly123", salt);
    const defaultUsers = [
      {
        id: "usr-1",
        name: "Hasna Hena",
        email: "admin@gardenvaly.com",
        passwordHash: demoAdminHash,
        role: "superadmin",
        isActive: true,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "usr-2",
        name: "Karim Uddin",
        email: "manager@gardenvaly.com",
        passwordHash: demoAdminHash,
        role: "store_manager",
        isActive: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    const defaultCategories = [
      {
        id: "cat-plants-indoor",
        slug: "indoor-plants",
        type: "plant",
        nameEn: "Indoor Plants",
        nameBn: "\u0987\u09A8\u09A1\u09CB\u09B0 \u0997\u09BE\u099B",
        descriptionEn: "Low-maintenance, air-purifying foliage suited for apartments and offices.",
        descriptionBn: "\u0998\u09B0\u09C7\u09B0 \u09AC\u09BE\u09A4\u09BE\u09B8 \u09AC\u09BF\u09B6\u09C1\u09A6\u09CD\u09A7\u0995\u09BE\u09B0\u09C0 \u0993 \u0985\u09B2\u09CD\u09AA \u09AF\u09A4\u09CD\u09A8\u09C7 \u09AC\u09C7\u0981\u099A\u09C7 \u09A5\u09BE\u0995\u09BE \u09A8\u09BE\u09A8\u09CD\u09A6\u09A8\u09BF\u0995 \u0987\u09A8\u09A1\u09CB\u09B0 \u0997\u09BE\u099B\u09AA\u09BE\u09B2\u09BE\u0964",
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        itemCount: 8,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "cat-plants-outdoor",
        slug: "outdoor-plants",
        type: "plant",
        nameEn: "Outdoor Plants",
        nameBn: "\u0986\u0989\u099F\u09A1\u09CB\u09B0 \u0993 \u099B\u09BE\u09A6\u09AC\u09BE\u0997\u09BE\u09A8 \u0997\u09BE\u099B",
        descriptionEn: "Hardy perennial plants and flowering shrubs for Bangladeshi climate.",
        descriptionBn: "\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7\u09B0 \u0986\u09AC\u09B9\u09BE\u0993\u09DF\u09BE\u09DF \u09AE\u09BE\u09A8\u09BE\u09A8\u09B8\u0987 \u09B0\u09CC\u09A6\u09CD\u09B0\u09AA\u09CD\u09B0\u09BF\u09DF \u0993 \u099B\u09BE\u09A6\u09AC\u09BE\u0997\u09BE\u09A8\u09C7\u09B0 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u0997\u09BE\u099B\u09AA\u09BE\u09B2\u09BE\u0964",
        imageUrl: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        itemCount: 6,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "cat-seeds-veg",
        slug: "vegetable-seeds",
        type: "seed",
        nameEn: "Vegetable Seeds",
        nameBn: "\u09B8\u09AC\u099C\u09BF \u09AC\u09C0\u099C",
        descriptionEn: "High-germination rate organic vegetable seeds for rooftop and backyard pots.",
        descriptionBn: "\u0989\u099A\u09CD\u099A \u0985\u0999\u09CD\u0995\u09C1\u09B0\u09CB\u09A6\u0997\u09AE \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u09AC\u09BF\u09B7\u09AE\u09C1\u0995\u09CD\u09A4 \u09A6\u09C7\u09B6\u09BF \u0993 \u09B9\u09BE\u0987\u09AC\u09CD\u09B0\u09BF\u09A1 \u09B8\u09AC\u099C\u09BF \u09AC\u09C0\u099C\u0964",
        imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        itemCount: 8,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "cat-seeds-flower",
        slug: "flower-seeds",
        type: "seed",
        nameEn: "Flower Seeds",
        nameBn: "\u09AB\u09C1\u09B2\u09C7\u09B0 \u09AC\u09C0\u099C",
        descriptionEn: "Fragrant and colorful seasonal flower seeds for balconies and verandahs.",
        descriptionBn: "\u09AC\u09BE\u09B0\u09BE\u09A8\u09CD\u09A6\u09BE \u0993 \u09AC\u09BE\u0997\u09BE\u09A8\u09C7 \u09AB\u09C1\u099F\u09A8\u09CD\u09A4 \u09AC\u09BE\u09B9\u09BE\u09B0\u09BF \u09B0\u0999 \u0993 \u09B8\u09C1\u09AC\u09BE\u09B8\u09BF\u09A4 \u098B\u09A4\u09C1\u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AC\u09C0\u099C\u0964",
        imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80",
        isActive: true,
        itemCount: 6,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    const defaultProducts = [
      {
        id: "plant-1",
        slug: "monstera-deliciosa",
        nameEn: "Monstera Deliciosa",
        nameBn: "\u09AE\u09A8\u09B8\u09CD\u099F\u09C7\u09B0\u09BE \u09A1\u09C7\u09B2\u09BF\u09B8\u09BF\u0993\u09B8\u09BE",
        botanicalName: "Monstera deliciosa Liebm.",
        category: "Indoor Plants",
        categorySlug: "indoor-plants",
        type: "plant",
        price: 850,
        originalPrice: 1050,
        discountPercent: 19,
        rating: 4.9,
        reviewsCount: 38,
        imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80",
        images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80"],
        isFeatured: true,
        isBestseller: true,
        inStock: true,
        stockQuantity: 24,
        SKU: "GV-PL-001",
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        isPublished: true,
        indoorOutdoor: "indoor",
        plantHeightEn: "14 - 18 inches",
        plantHeightBn: "\u09E7\u09EA - \u09E7\u09EE \u0987\u099E\u09CD\u099A\u09BF",
        plantAgeEn: "8 months well-rooted",
        plantAgeBn: "\u09EE \u09AE\u09BE\u09B8 \u09AC\u09DF\u09B8\u09C0 \u09B8\u09C1\u09B8\u09CD\u09A5 \u099A\u09BE\u09B0\u09BE",
        sunlightEn: "Bright indirect sunlight",
        sunlightBn: "\u0989\u099C\u09CD\u099C\u09CD\u09AC\u09B2 \u0995\u09BF\u09A8\u09CD\u09A4\u09C1 \u09AA\u09B0\u09CB\u0995\u09CD\u09B7 \u0986\u09B2\u09CB",
        waterEn: "Water when top 2 inches dry",
        waterBn: "\u0989\u09AA\u09B0\u09C7\u09B0 \u09E8 \u0987\u099E\u09CD\u099A\u09BF \u09AE\u09BE\u099F\u09BF \u09B6\u09C1\u0995\u09BF\u09DF\u09C7 \u0997\u09C7\u09B2\u09C7 \u099C\u09B2 \u09A6\u09BF\u09A8",
        soilTypeEn: "Aerated organic potting mix",
        soilTypeBn: "\u09B8\u09BE\u09B0\u09AF\u09C1\u0995\u09CD\u09A4 \u099D\u09C1\u09B0\u099D\u09C1\u09B0\u09C7 \u09AE\u09BE\u099F\u09BF \u0993 \u0995\u09CB\u0995\u09CB\u09AA\u09BF\u099F",
        tagsEn: ["indoor", "air-purifier", "swiss-cheese", "statement"],
        tagsBn: ["\u0987\u09A8\u09A1\u09CB\u09B0", "\u09AC\u09BE\u09A4\u09BE\u09B8-\u09AC\u09BF\u09B6\u09C1\u09A6\u09CD\u09A7\u0995\u09BE\u09B0\u09C0", "\u0986\u09AD\u09BF\u099C\u09BE\u09A4\u09CD\u09AF", "\u099B\u09BE\u09DF\u09BE \u09AA\u09CD\u09B0\u09BF\u09DF"],
        descriptionEn: "The iconic Swiss Cheese Plant with striking fenestrated foliage.",
        descriptionBn: "\u09A8\u09BE\u09A8\u09CD\u09A6\u09A8\u09BF\u0995 \u0996\u09BE\u0981\u099C\u0995\u09BE\u099F\u09BE \u09AA\u09BE\u09A4\u09BE\u09B0 \u099C\u09A8\u09AA\u09CD\u09B0\u09BF\u09DF \u0987\u09A8\u09A1\u09CB\u09B0 \u0997\u09BE\u099B \u09AE\u09A8\u09B8\u09CD\u099F\u09C7\u09B0\u09BE \u09A1\u09C7\u09B2\u09BF\u09B8\u09BF\u0993\u09B8\u09BE\u0964"
      },
      {
        id: "plant-2",
        slug: "snake-plant-laurentii",
        nameEn: "Snake Plant Laurentii",
        nameBn: "\u09B8\u09CD\u09A8\u09C7\u0995 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u09A8\u09CD\u099F \u09B2\u09B0\u09C7\u09A8\u09CD\u09A4\u09BF",
        botanicalName: "Dracaena trifasciata",
        category: "Indoor Plants",
        categorySlug: "indoor-plants",
        type: "plant",
        price: 450,
        originalPrice: 550,
        discountPercent: 18,
        rating: 4.8,
        reviewsCount: 42,
        imageUrl: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&auto=format&fit=crop&q=80",
        images: ["https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?w=800&auto=format&fit=crop&q=80"],
        isFeatured: true,
        isBestseller: true,
        inStock: true,
        stockQuantity: 40,
        SKU: "GV-PL-002",
        createdAt: "2025-01-12T10:00:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        isPublished: true,
        indoorOutdoor: "indoor",
        plantHeightEn: "10 - 14 inches",
        plantHeightBn: "\u09E7\u09E6 - \u09E7\u09EA \u0987\u099E\u09CD\u099A\u09BF",
        plantAgeEn: "6 months hardy rhizome",
        plantAgeBn: "\u09EC \u09AE\u09BE\u09B8 \u09AC\u09DF\u09B8\u09C0 \u09B6\u0995\u09CD\u09A4 \u09AE\u09C2\u09B2",
        sunlightEn: "Low to bright indirect light",
        sunlightBn: "\u0985\u09B2\u09CD\u09AA \u0986\u09B2\u09CB \u09A5\u09C7\u0995\u09C7 \u09AE\u09BE\u099D\u09BE\u09B0\u09BF \u0986\u09B2\u09CB",
        waterEn: "Every 10-14 days",
        waterBn: "\u09E7\u09E6-\u09E7\u09EA \u09A6\u09BF\u09A8\u09C7 \u098F\u0995\u09AC\u09BE\u09B0",
        soilTypeEn: "Well-draining cactus/succulent mix",
        soilTypeBn: "\u09AA\u09BE\u09A8\u09BF \u09A8\u09BF\u09B7\u09CD\u0995\u09BE\u09B6\u09A8\u09AF\u09CB\u0997\u09CD\u09AF \u09A6\u09CB\u0986\u0981\u09B6 \u09AE\u09BE\u099F\u09BF",
        tagsEn: ["hardy", "air-purifier", "low-light", "bedroom"],
        tagsBn: ["\u09B8\u09B9\u099C \u09AF\u09A4\u09CD\u09A8", "\u09AC\u09BE\u09A4\u09BE\u09B8-\u09B6\u09CB\u09A7\u09A8\u0995\u09BE\u09B0\u09C0", "\u09B6\u09CB\u09AC\u09BE\u09B0 \u0998\u09B0"],
        descriptionEn: "Top-rated air purifier with striking yellow borders on sword-like leaves.",
        descriptionBn: "\u09A8\u09BE\u09B8\u09BE \u09B8\u09CD\u09AC\u09C0\u0995\u09C3\u09A4 \u09B6\u09C0\u09B0\u09CD\u09B7 \u09AC\u09BE\u09DF\u09C1 \u09AC\u09BF\u09B6\u09C1\u09A6\u09CD\u09A7\u0995\u09BE\u09B0\u09C0 \u0993 \u09AA\u09CD\u09B0\u09BE\u09DF \u0985\u09AC\u09BF\u09A8\u09BE\u09B6\u09C0 \u0998\u09B0\u09C7\u09B0 \u0997\u09BE\u099B\u0964"
      },
      {
        id: "seed-1",
        slug: "heirloom-tomato-seeds",
        nameEn: "Heirloom Tomato Seeds",
        nameBn: "\u099F\u09AE\u09C7\u099F\u09CB \u09AC\u09C0\u099C (\u0989\u09A8\u09CD\u09A8\u09A4 \u099C\u09BE\u09A4)",
        botanicalName: "Solanum lycopersicum",
        category: "Vegetable Seeds",
        categorySlug: "vegetable-seeds",
        type: "seed",
        price: 120,
        originalPrice: 150,
        discountPercent: 20,
        rating: 4.9,
        reviewsCount: 54,
        imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80",
        images: ["https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80"],
        isFeatured: true,
        isBestseller: true,
        inStock: true,
        stockQuantity: 150,
        SKU: "GV-SD-001",
        createdAt: "2025-01-05T10:00:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        isPublished: true,
        packetSizeEn: "50+ High Germination Seeds",
        packetSizeBn: "\u09EB\u09E6+ \u0989\u099A\u09CD\u099A \u0985\u0999\u09CD\u0995\u09C1\u09B0\u09CB\u09A6\u0997\u09AE\u09C7\u09B0 \u09AC\u09C0\u099C",
        plantingSeasonEn: "Autumn to Early Winter (September - December)",
        plantingSeasonBn: "\u09B6\u09B0\u09CE \u09A5\u09C7\u0995\u09C7 \u09B9\u09C7\u09AE\u09A8\u09CD\u09A4/\u09B6\u09C0\u09A4\u0995\u09BE\u09B2 (\u0986\u09B6\u09CD\u09AC\u09BF\u09A8 - \u09AA\u09CC\u09B7)",
        sunlightEn: "Full Sun (6+ hours)",
        sunlightBn: "\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B0\u09CB\u09A6 (\u0995\u09AE\u09AA\u0995\u09CD\u09B7\u09C7 \u09EC \u0998\u09A3\u09CD\u099F\u09BE)",
        waterEn: "Regular moderate moisture",
        waterBn: "\u09A8\u09BF\u09DF\u09AE\u09BF\u09A4 \u09AA\u09B0\u09BF\u09AE\u09BF\u09A4 \u0986\u09B0\u09CD\u09A6\u09CD\u09B0\u09A4\u09BE",
        tagsEn: ["vegetable", "heirloom", "organic", "rooftop"],
        tagsBn: ["\u09B8\u09AC\u099C\u09BF", "\u0989\u09A8\u09CD\u09A8\u09A4 \u09AC\u09C0\u099C", "\u099B\u09BE\u09A6\u09AC\u09BE\u0997\u09BE\u09A8", "\u09AB\u09B2\u09A8"],
        descriptionEn: "Sweet, juicy organic heirloom tomato seeds with 88%+ tested germination rate.",
        descriptionBn: "\u09AE\u09BF\u09B7\u09CD\u099F\u09BF \u0993 \u09B0\u09B8\u09BE\u09B2\u09CB \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u099F\u09AE\u09C7\u099F\u09CB \u09AC\u09C0\u099C, \u099B\u09BE\u09A6\u09AC\u09BE\u0997\u09BE\u09A8\u09C7\u09B0 \u099F\u09AC\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u099A\u09AE\u09CE\u0995\u09BE\u09B0 \u0989\u09AA\u09AF\u09CB\u0997\u09C0\u0964"
      },
      {
        id: "seed-2",
        slug: "hot-chili-seeds",
        nameEn: "Bangladeshi Hot Chili Seeds",
        nameBn: "\u099D\u09BE\u09B2 \u09AE\u09B0\u09BF\u099A \u09AC\u09C0\u099C (\u09A6\u09C7\u09B6\u09BF \u09AC\u09CB\u09AE\u09CD\u09AC\u09BE\u0987)",
        botanicalName: "Capsicum frutescens",
        category: "Vegetable Seeds",
        categorySlug: "vegetable-seeds",
        type: "seed",
        price: 90,
        originalPrice: 110,
        discountPercent: 18,
        rating: 4.7,
        reviewsCount: 31,
        imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80",
        images: ["https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80"],
        isFeatured: true,
        isBestseller: false,
        inStock: true,
        stockQuantity: 95,
        SKU: "GV-SD-002",
        createdAt: "2025-01-08T10:00:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        isPublished: true,
        packetSizeEn: "60+ Vigorous Seeds",
        packetSizeBn: "\u09EC\u09E6+ \u09B0\u09CB\u0997 \u09AA\u09CD\u09B0\u09A4\u09BF\u09B0\u09CB\u09A7\u09C0 \u09AC\u09C0\u099C",
        plantingSeasonEn: "Year-round planting",
        plantingSeasonBn: "\u09B8\u09BE\u09B0\u09BE \u09AC\u099B\u09B0 \u09B0\u09CB\u09AA\u09A3 \u0989\u09AA\u09AF\u09CB\u0997\u09C0",
        sunlightEn: "Full Direct Sun",
        sunlightBn: "\u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09B0\u09CB\u09A6",
        waterEn: "Moderate drainage",
        waterBn: "\u09AE\u09BE\u099F\u09BF \u09B6\u09C1\u0995\u09BF\u09DF\u09C7 \u0986\u09B8\u09B2\u09C7 \u099C\u09B2 \u09A6\u09BF\u09A8",
        tagsEn: ["chili", "spicy", "organic", "pots"],
        tagsBn: ["\u09AE\u09B0\u09BF\u099A", "\u099D\u09BE\u09B2", "\u099F\u09AC \u0989\u09AA\u09AF\u09CB\u0997\u09C0"],
        descriptionEn: "Vigorous high-yield local chili seeds with intense aroma and sharp heat.",
        descriptionBn: "\u09B8\u09C1\u0997\u09A8\u09CD\u09A7\u09AF\u09C1\u0995\u09CD\u09A4 \u09A4\u09C0\u09AC\u09CD\u09B0 \u099D\u09BE\u09B2 \u09A6\u09C7\u09B6\u09BF \u09AE\u09B0\u09BF\u099A\u09C7\u09B0 \u099A\u09BE\u09B0\u09BE \u09A4\u09C8\u09B0\u09BF\u09B0 \u09AC\u09BF\u09B6\u09CD\u09AC\u09B8\u09CD\u09A4 \u09B8\u09A4\u09C7\u099C \u09AC\u09C0\u099C\u0964"
      }
    ];
    const defaultCustomers = [
      {
        id: "cust-101",
        fullName: "Tahmina Akter",
        mobileNumber: "01712345678",
        email: "tahmina.gardener@gmail.com",
        division: "Dhaka",
        district: "Dhaka",
        upazila: "Dhanmondi",
        addressDetail: "House 42, Road 9/A, Dhanmondi R/A, Rooftop Garden",
        totalOrders: 3,
        totalSpent: 4250,
        firstOrderDate: "2025-11-12T14:20:00Z",
        lastOrderDate: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: "2025-11-12T14:20:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "cust-102",
        fullName: "Dr. Rafiqul Islam",
        mobileNumber: "01898765432",
        email: "rafiqul.trees@gmail.com",
        division: "Chittagong",
        district: "Chittagong",
        upazila: "Khulshi",
        addressDetail: "Flat 6A, Green Tower, South Khulshi Residential",
        totalOrders: 2,
        totalSpent: 2180,
        firstOrderDate: "2025-12-01T10:00:00Z",
        lastOrderDate: "2026-02-14T11:30:00Z",
        createdAt: "2025-12-01T10:00:00Z",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    const defaultOrders = [
      {
        id: "ord-1001",
        orderNumber: "GV-2026-0841",
        customer: {
          fullName: "Tahmina Akter",
          mobileNumber: "01712345678",
          email: "tahmina.gardener@gmail.com",
          division: "Dhaka",
          district: "Dhaka",
          upazila: "Dhanmondi",
          addressDetail: "House 42, Road 9/A, Dhanmondi R/A, Rooftop Garden",
          deliveryInstructions: "Please deliver before 4 PM. Ring bell 4B."
        },
        items: [
          {
            productId: "plant-1",
            productName: "Monstera Deliciosa",
            slug: "monstera-deliciosa",
            imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&auto=format&fit=crop&q=80",
            quantity: 1,
            unitPrice: 850,
            lineSubtotal: 850
          },
          {
            productId: "seed-1",
            productName: "Heirloom Tomato Seeds",
            slug: "heirloom-tomato-seeds",
            imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&auto=format&fit=crop&q=80",
            quantity: 2,
            unitPrice: 120,
            lineSubtotal: 240
          }
        ],
        subtotal: 1090,
        deliveryCharge: 60,
        totalAmount: 1150,
        deliveryMethod: "home-delivery",
        paymentMethod: "cash-on-delivery",
        paymentStatus: "unpaid",
        status: "pending",
        statusHistory: [
          {
            status: "pending",
            changedAt: new Date(Date.now() - 36e5 * 4).toISOString(),
            note: "Order placed via website checkout"
          }
        ],
        adminNotes: "Customer requested sturdy packaging for rooftop transit.",
        createdAt: new Date(Date.now() - 36e5 * 4).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    const defaultAdjustments = [
      {
        id: "inv-adj-1",
        productId: "plant-1",
        productName: "Monstera Deliciosa",
        quantityChanged: 10,
        newQuantity: 24,
        reason: "Restock from nursery nursery batch #4",
        adminUserName: "Hasna Hena",
        createdAt: new Date(Date.now() - 864e5).toISOString()
      }
    ];
    const defaultSettings = {
      storeNameEn: "Gardenvaly",
      storeNameBn: "\u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF",
      signatureEn: "by Hasna Hena",
      signatureBn: "\u09B9\u09BE\u09B8\u09A8\u09BE \u09B9\u09C7\u09A8\u09BE \u0995\u09B0\u09CD\u09A4\u09C3\u0995 \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09BF\u09A4",
      taglineEn: "Grow Green, Live Beautiful",
      taglineBn: "\u09B8\u09AC\u09C1\u099C\u09C7 \u09B8\u09BE\u099C\u09C1\u0995 \u099C\u09C0\u09AC\u09A8",
      contactPhone: "+880 1712-345678",
      contactEmail: "contact@gardenvaly.com",
      officialWhatsapp: "+880 1712-345678",
      standardDeliveryFee: 60,
      freeDeliveryThreshold: 2e3,
      enablePickup: true,
      orderNotificationEmail: "admin@gardenvaly.com",
      maintenanceMode: false,
      demoModeNotice: true
    };
    this.data = {
      users: defaultUsers,
      categories: defaultCategories,
      products: defaultProducts,
      customers: defaultCustomers,
      orders: defaultOrders,
      inventoryAdjustments: defaultAdjustments,
      settings: defaultSettings
    };
  }
  persist() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("[DB] Error persisting store.json:", err);
    }
  }
  // USERS
  findUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  findUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }
  updateUserLastLogin(id) {
    const user = this.data.users.find((u) => u.id === id);
    if (user) {
      user.lastLogin = (/* @__PURE__ */ new Date()).toISOString();
      this.persist();
    }
  }
  // PRODUCTS
  getProducts(filters) {
    let prods = [...this.data.products];
    if (filters?.publishedOnly) {
      prods = prods.filter((p) => p.isPublished !== false);
    }
    if (filters?.category) {
      prods = prods.filter((p) => p.categorySlug === filters.category);
    }
    if (filters?.type) {
      prods = prods.filter((p) => p.type === filters.type);
    }
    if (filters?.inStockOnly) {
      prods = prods.filter((p) => p.inStock && p.stockQuantity > 0);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      prods = prods.filter(
        (p) => p.nameEn.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q) || p.SKU.toLowerCase().includes(q)
      );
    }
    return prods;
  }
  getProductById(id) {
    return this.data.products.find((p) => p.id === id || p.slug === id);
  }
  findProductBySlug(slug) {
    return this.data.products.find((p) => p.slug === slug);
  }
  createProduct(product) {
    const id = `prod-${Date.now()}`;
    const newProd = {
      ...product,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.products.unshift(newProd);
    this.persist();
    return newProd;
  }
  updateProduct(id, updates) {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.persist();
    return this.data.products[index];
  }
  deleteProduct(id) {
    const index = this.data.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.persist();
    return true;
  }
  // CATEGORIES
  getCategories() {
    return [...this.data.categories];
  }
  createCategory(cat) {
    const newCat = {
      ...cat,
      id: `cat-${Date.now()}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.categories.push(newCat);
    this.persist();
    return newCat;
  }
  updateCategory(id, updates) {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = {
      ...this.data.categories[index],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.persist();
    return this.data.categories[index];
  }
  deleteCategory(id) {
    const index = this.data.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.persist();
    return true;
  }
  // ORDERS
  getOrders(filters) {
    let orders = [...this.data.orders];
    if (filters?.status && filters.status !== "all") {
      orders = orders.filter((o) => o.status === filters.status);
    }
    if (filters?.paymentStatus && filters.paymentStatus !== "all") {
      orders = orders.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    if (filters?.paymentMethod && filters.paymentMethod !== "all") {
      orders = orders.filter((o) => o.paymentMethod === filters.paymentMethod);
    }
    if (filters?.deliveryArea && filters.deliveryArea !== "all") {
      if (filters.deliveryArea === "dhaka") {
        orders = orders.filter(
          (o) => o.customer.division?.toLowerCase().includes("dhaka") || o.customer.district?.toLowerCase().includes("dhaka")
        );
      } else if (filters.deliveryArea === "outside_dhaka") {
        orders = orders.filter(
          (o) => !o.customer.division?.toLowerCase().includes("dhaka") && !o.customer.district?.toLowerCase().includes("dhaka")
        );
      }
    }
    if (filters?.startDate) {
      const start = new Date(filters.startDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() >= start);
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate).getTime() + 864e5;
      orders = orders.filter((o) => new Date(o.createdAt).getTime() <= end);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customer.fullName.toLowerCase().includes(q) || o.customer.mobileNumber.includes(q)
      );
    }
    switch (filters?.sortBy) {
      case "oldest":
        orders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "highest_total":
        orders.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "lowest_total":
        orders.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      case "newest":
      default:
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    const total = orders.length;
    const page = Math.max(1, filters?.page || 1);
    const limit = filters?.limit ? Math.max(1, filters.limit) : 50;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);
    return {
      orders: paginatedOrders,
      total,
      page,
      limit
    };
  }
  getOrderById(id) {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }
  createOrder(orderData) {
    const id = `ord-${Date.now()}`;
    const randomSuffix = Math.floor(1e3 + Math.random() * 9e3);
    const orderNumber = `GV-2026-${randomSuffix}`;
    const isCod = orderData.paymentMethod === "cash-on-delivery";
    const newOrder = {
      id,
      orderNumber,
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryCharge: orderData.deliveryCharge,
      discountAmount: orderData.discountAmount || 0,
      totalAmount: orderData.totalAmount,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "unpaid",
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          changedAt: (/* @__PURE__ */ new Date()).toISOString(),
          note: "Order placed via API checkout",
          changedBy: "Customer (Online Checkout)"
        }
      ],
      adminNotes: orderData.adminNotes,
      codExpectedAmount: isCod ? orderData.totalAmount : 0,
      codCollectedAmount: 0,
      codOutstandingBalance: isCod ? orderData.totalAmount : 0,
      codStatus: isCod ? "awaiting_collection" : void 0,
      isStockRestored: false,
      auditTrail: [
        {
          action: "ORDER_CREATED",
          performedBy: "Customer",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          details: `Order created with ${orderData.items.length} items. Total: \u09F3${orderData.totalAmount}. Payment: ${orderData.paymentMethod}`
        }
      ],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.orders.unshift(newOrder);
    this.upsertCustomerFromOrder(newOrder);
    for (const item of newOrder.items) {
      const prod = this.data.products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        prod.inStock = prod.stockQuantity > 0;
      }
    }
    this.persist();
    return newOrder;
  }
  updateOrderStatus(id, newStatus, note, performedBy = "Administrator") {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: "Order not found" };
    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: newStatus,
      changedAt: (/* @__PURE__ */ new Date()).toISOString(),
      note: note || `Status updated from ${oldStatus} to ${newStatus}`,
      changedBy: performedBy
    });
    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: "STATUS_CHANGED",
      performedBy,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      previousValue: oldStatus,
      newValue: newStatus,
      details: note || `Order status updated to ${newStatus}`
    });
    if (newStatus === "cancelled" && !order.isStockRestored) {
      for (const item of order.items) {
        const prod = this.data.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stockQuantity += item.quantity;
          prod.inStock = prod.stockQuantity > 0;
          this.data.inventoryAdjustments.unshift({
            id: `adj-${Date.now()}-${item.productId}`,
            productId: prod.id,
            productName: prod.nameEn,
            quantityChanged: item.quantity,
            newQuantity: prod.stockQuantity,
            reason: `Order cancelled (#${order.orderNumber}) - stock returned`,
            adminUserName: performedBy,
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      }
      order.isStockRestored = true;
      order.auditTrail.push({
        action: "STOCK_RESTORED",
        performedBy,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        details: "All ordered item quantities restored to inventory safely without duplication."
      });
    }
    if (newStatus === "delivered" && !order.actualDeliveryDate) {
      order.actualDeliveryDate = (/* @__PURE__ */ new Date()).toISOString();
    }
    this.persist();
    return { success: true, order };
  }
  updateOrderPaymentStatus(id, paymentStatus, performedBy = "Administrator") {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;
    const oldPayment = order.paymentStatus;
    order.paymentStatus = paymentStatus;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: "PAYMENT_STATUS_UPDATED",
      performedBy,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      previousValue: oldPayment,
      newValue: paymentStatus,
      details: `Payment status updated to ${paymentStatus}`
    });
    this.persist();
    return order;
  }
  updateOrderDelivery(id, deliveryData, performedBy = "Administrator") {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;
    if (deliveryData.deliveryProvider !== void 0) order.deliveryProvider = deliveryData.deliveryProvider;
    if (deliveryData.trackingNumber !== void 0) order.trackingNumber = deliveryData.trackingNumber;
    if (deliveryData.dispatchDate !== void 0) order.dispatchDate = deliveryData.dispatchDate;
    if (deliveryData.expectedDeliveryDate !== void 0) order.expectedDeliveryDate = deliveryData.expectedDeliveryDate;
    if (deliveryData.deliveryNotes !== void 0) order.deliveryNotes = deliveryData.deliveryNotes;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: "DELIVERY_INFO_UPDATED",
      performedBy,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: `Courier provider: ${order.deliveryProvider || "N/A"}, Tracking: ${order.trackingNumber || "N/A"}`
    });
    this.persist();
    return order;
  }
  recordCodCollection(id, data, performedBy = "Administrator") {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: "Order not found" };
    const expected = order.codExpectedAmount || order.totalAmount;
    const collected = Number(data.collectedAmount);
    if (isNaN(collected) || collected < 0) {
      return { success: false, error: "Invalid collected amount" };
    }
    order.codCollectedAmount = collected;
    order.codCollectedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.codCollectedByStaff = data.collectedByStaff || performedBy;
    order.codOutstandingBalance = Math.max(0, expected - collected);
    if (collected >= expected) {
      order.codStatus = "collected";
      order.paymentStatus = "paid";
    } else if (collected > 0) {
      order.codStatus = "partially_collected";
    } else {
      order.codStatus = "discrepancy";
    }
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: "COD_COLLECTION_RECORDED",
      performedBy,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: `Collected \u09F3${collected} out of expected \u09F3${expected} by ${order.codCollectedByStaff}. Outstanding: \u09F3${order.codOutstandingBalance}`
    });
    this.persist();
    return { success: true, order };
  }
  processOrderReturn(id, data, performedBy = "Administrator") {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: "Order not found" };
    if (data.action === "request") {
      order.status = "return_requested";
      order.returnReason = data.reason || "Customer requested return";
      order.returnRequestedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.returnStatus = "pending_review";
    } else if (data.action === "approve") {
      order.status = "returned";
      order.returnStatus = "approved";
      order.returnReviewedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.returnedQuantities = data.returnedQuantities;
      if (data.restoreToStock && data.returnedQuantities) {
        for (const [prodId, qty] of Object.entries(data.returnedQuantities)) {
          const numQty = Number(qty);
          if (numQty > 0) {
            const prod = this.data.products.find((p) => p.id === prodId);
            if (prod) {
              prod.stockQuantity += numQty;
              prod.inStock = prod.stockQuantity > 0;
              this.data.inventoryAdjustments.unshift({
                id: `adj-ret-${Date.now()}-${prodId}`,
                productId: prod.id,
                productName: prod.nameEn,
                quantityChanged: numQty,
                newQuantity: prod.stockQuantity,
                reason: `Returned sellable items inspected (#${order.orderNumber})`,
                adminUserName: performedBy,
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              });
            }
          }
        }
      }
    } else if (data.action === "reject") {
      order.returnStatus = "rejected";
      order.returnReviewedAt = (/* @__PURE__ */ new Date()).toISOString();
      order.status = "delivered";
    }
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: `RETURN_${data.action.toUpperCase()}`,
      performedBy,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: data.reason || `Return action ${data.action} processed.`
    });
    this.persist();
    return { success: true, order };
  }
  recordOrderRefund(id, data, performedBy = "Administrator") {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return { success: false, error: "Order not found" };
    const refundAmount = Number(data.amount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      return { success: false, error: "Refund amount must be greater than 0" };
    }
    if (refundAmount > order.totalAmount) {
      return { success: false, error: `Refund amount cannot exceed total order value (\u09F3${order.totalAmount})` };
    }
    order.refundAmount = refundAmount;
    order.refundReason = data.reason;
    order.refundRecordedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.refundRecordedBy = performedBy;
    if (refundAmount >= order.totalAmount) {
      order.paymentStatus = "refunded";
      order.status = "refunded";
    } else {
      order.paymentStatus = "partially_refunded";
    }
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!order.auditTrail) order.auditTrail = [];
    order.auditTrail.push({
      action: "REFUND_RECORDED",
      performedBy,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: `Refunded \u09F3${refundAmount}. Reason: ${data.reason}`
    });
    this.persist();
    return { success: true, order };
  }
  // CUSTOMERS
  getCustomers() {
    return [...this.data.customers];
  }
  getCustomerById(id) {
    return this.data.customers.find((c) => c.id === id);
  }
  upsertCustomerFromOrder(order) {
    const existing = this.data.customers.find(
      (c) => c.mobileNumber === order.customer.mobileNumber
    );
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.totalAmount;
      existing.lastOrderDate = order.createdAt;
      existing.fullName = order.customer.fullName || existing.fullName;
      existing.addressDetail = order.customer.addressDetail || existing.addressDetail;
      existing.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    } else {
      const newCust = {
        id: `cust-${Date.now()}`,
        fullName: order.customer.fullName,
        mobileNumber: order.customer.mobileNumber,
        email: order.customer.email,
        division: order.customer.division,
        district: order.customer.district,
        upazila: order.customer.upazila,
        addressDetail: order.customer.addressDetail,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        firstOrderDate: order.createdAt,
        lastOrderDate: order.createdAt,
        createdAt: order.createdAt,
        updatedAt: order.createdAt
      };
      this.data.customers.push(newCust);
    }
  }
  // INVENTORY
  getInventoryAdjustments() {
    return [...this.data.inventoryAdjustments];
  }
  adjustStock(productId, quantityChanged, reason, adminUserName) {
    const prod = this.data.products.find((p) => p.id === productId);
    if (!prod) return null;
    prod.stockQuantity = Math.max(0, prod.stockQuantity + quantityChanged);
    prod.inStock = prod.stockQuantity > 0;
    prod.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const adjustment = {
      id: `inv-${Date.now()}`,
      productId,
      productName: prod.nameEn,
      quantityChanged,
      newQuantity: prod.stockQuantity,
      reason,
      adminUserName,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.inventoryAdjustments.unshift(adjustment);
    this.persist();
    return prod;
  }
  // SETTINGS
  getSettings() {
    return { ...this.data.settings };
  }
  updateSettings(updates) {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.persist();
    return { ...this.data.settings };
  }
  // REPORTING & ANALYTICS
  getDateFilterBounds(range, customStart, customEnd) {
    const now = /* @__PURE__ */ new Date();
    const nowUtc = now.getTime();
    const dhakaOffset = 6 * 3600 * 1e3;
    const dhakaNow = new Date(nowUtc + dhakaOffset);
    const startOfDhakaDay = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth(), dhakaNow.getDate()).getTime() - dhakaOffset;
    const endOfDhakaDay = startOfDhakaDay + 864e5 - 1;
    switch (range) {
      case "today":
        return { start: startOfDhakaDay, end: endOfDhakaDay, label: "Today (\u0986\u099C\u0995\u09C7)" };
      case "yesterday": {
        const start = startOfDhakaDay - 864e5;
        const end = startOfDhakaDay - 1;
        return { start, end, label: "Yesterday (\u0997\u09A4\u0995\u09BE\u09B2)" };
      }
      case "last_7_days": {
        const start = startOfDhakaDay - 6 * 864e5;
        return { start, end: endOfDhakaDay, label: "Last 7 Days (\u0997\u09A4 \u09ED \u09A6\u09BF\u09A8)" };
      }
      case "last_30_days": {
        const start = startOfDhakaDay - 29 * 864e5;
        return { start, end: endOfDhakaDay, label: "Last 30 Days (\u0997\u09A4 \u09E9\u09E6 \u09A6\u09BF\u09A8)" };
      }
      case "this_month": {
        const start = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth(), 1).getTime() - dhakaOffset;
        return { start, end: endOfDhakaDay, label: "This Month (\u099A\u09B2\u09A4\u09BF \u09AE\u09BE\u09B8)" };
      }
      case "previous_month": {
        const start = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth() - 1, 1).getTime() - dhakaOffset;
        const end = new Date(dhakaNow.getFullYear(), dhakaNow.getMonth(), 0, 23, 59, 59, 999).getTime() - dhakaOffset;
        return { start, end, label: "Previous Month (\u09AA\u09C2\u09B0\u09CD\u09AC\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AE\u09BE\u09B8)" };
      }
      case "custom": {
        if (customStart && customEnd) {
          const start = new Date(customStart).getTime();
          const end = new Date(customEnd).getTime() + 864e5 - 1;
          return { start, end, label: `Custom: ${customStart} to ${customEnd}` };
        }
        return { start: 0, end: Date.now() + 864e5, label: "All Time (\u09B8\u09B0\u09CD\u09AC\u0995\u09BE\u09B2\u09C0\u09A8)" };
      }
      case "all_time":
      default:
        return { start: 0, end: Date.now() + 864e5, label: "All Time (\u09B8\u09B0\u09CD\u09AC\u0995\u09BE\u09B2\u09C0\u09A8)" };
    }
  }
  getDashboardMetrics(range = "all_time", customStart, customEnd) {
    const { start, end, label } = this.getDateFilterBounds(range, customStart, customEnd);
    const inRangeOrders = this.data.orders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();
      return orderTime >= start && orderTime <= end;
    });
    const totalOrders = inRangeOrders.length;
    const pendingOrders = inRangeOrders.filter((o) => o.status === "pending").length;
    const confirmedOrders = inRangeOrders.filter((o) => o.status === "confirmed").length;
    const processingOrders = inRangeOrders.filter((o) => o.status === "processing").length;
    const shippedOrders = inRangeOrders.filter((o) => o.status === "shipped").length;
    const deliveredOrders = inRangeOrders.filter((o) => o.status === "delivered").length;
    const cancelledOrders = inRangeOrders.filter((o) => o.status === "cancelled").length;
    const nonCancelledOrders = inRangeOrders.filter((o) => o.status !== "cancelled");
    const totalOrderValue = nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const deliveredList = inRangeOrders.filter((o) => o.status === "delivered");
    const deliveredOrderValue = deliveredList.reduce((sum, o) => sum + o.totalAmount, 0);
    const actualCollectedPayments = inRangeOrders.reduce((sum, o) => {
      if (o.paymentStatus === "paid" && o.paymentMethod !== "cash-on-delivery") {
        return sum + o.totalAmount;
      }
      return sum + (o.codCollectedAmount || 0);
    }, 0);
    const outstandingCod = inRangeOrders.filter((o) => o.paymentMethod === "cash-on-delivery" && o.status !== "cancelled").reduce((sum, o) => sum + (o.codOutstandingBalance ?? o.totalAmount - (o.codCollectedAmount || 0)), 0);
    const totalRefunds = inRangeOrders.reduce((sum, o) => sum + (o.refundAmount || 0), 0);
    const netSales = Math.max(0, deliveredOrderValue - totalRefunds);
    const validCountForAov = nonCancelledOrders.length;
    const averageOrderValue = validCountForAov > 0 ? Math.round(totalOrderValue / validCountForAov) : 0;
    const totalProducts = this.data.products.length;
    const plantProducts = this.data.products.filter((p) => p.type === "plant").length;
    const seedProducts = this.data.products.filter((p) => p.type === "seed").length;
    const lowStockProducts = this.data.products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
    const outOfStockProducts = this.data.products.filter((p) => p.stockQuantity === 0).length;
    const totalCustomers = this.data.customers.length;
    return {
      // 12 Mandatory Summary Cards
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalOrderValue,
      actualCollectedPayments,
      outstandingCod,
      totalProducts,
      lowStockProducts,
      // Accurate business metrics
      deliveredOrderValue,
      netSales,
      totalRefunds,
      averageOrderValue,
      profitStatus: "Profit data not configured (Cost tracking required)",
      plantProducts,
      seedProducts,
      outOfStockProducts,
      totalCustomers,
      timeRangeLabel: label,
      timezone: "Asia/Dhaka (UTC+6)"
    };
  }
  getSalesTrend(range = "last_30_days") {
    const { start, end } = this.getDateFilterBounds(range);
    const inRangeOrders = this.data.orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t <= end && o.status !== "cancelled";
    });
    const dayMap = /* @__PURE__ */ new Map();
    const numDays = Math.min(30, Math.ceil((end - start) / 864e5));
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date(end - i * 864e5);
      const iso = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      dayMap.set(iso, { date: iso, label, sales: 0, ordersCount: 0 });
    }
    inRangeOrders.forEach((o) => {
      const iso = o.createdAt.slice(0, 10);
      const existing = dayMap.get(iso);
      if (existing) {
        existing.sales += o.totalAmount;
        existing.ordersCount += 1;
      } else {
        const d = new Date(o.createdAt);
        dayMap.set(iso, {
          date: iso,
          label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          sales: o.totalAmount,
          ordersCount: 1
        });
      }
    });
    return Array.from(dayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
  getStatusDistribution(range = "all_time") {
    const { start, end } = this.getDateFilterBounds(range);
    const inRangeOrders = this.data.orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t <= end;
    });
    const statuses = [
      { key: "pending", labelEn: "Pending", labelBn: "\u09A8\u09A4\u09C1\u09A8 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0", color: "#D97706" },
      { key: "confirmed", labelEn: "Confirmed", labelBn: "\u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4", color: "#2563EB" },
      { key: "processing", labelEn: "Processing", labelBn: "\u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u09B9\u099A\u09CD\u099B\u09C7", color: "#7C3AED" },
      { key: "packed", labelEn: "Packed", labelBn: "\u09AA\u09CD\u09AF\u09BE\u0995 \u0995\u09B0\u09BE", color: "#0D9488" },
      { key: "shipped", labelEn: "Shipped", labelBn: "\u09B6\u09BF\u09AA\u09A1", color: "#0284C7" },
      { key: "delivered", labelEn: "Delivered", labelBn: "\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09CD\u09A1", color: "#15803D" },
      { key: "cancelled", labelEn: "Cancelled", labelBn: "\u09AC\u09BE\u09A4\u09BF\u09B2", color: "#DC2626" },
      { key: "return_requested", labelEn: "Return Req.", labelBn: "\u09B0\u09BF\u099F\u09BE\u09B0\u09CD\u09A8 \u0986\u09AC\u09C7\u09A6\u09A8", color: "#C026D3" },
      { key: "returned", labelEn: "Returned", labelBn: "\u09AB\u09C7\u09B0\u09A4", color: "#4B5563" },
      { key: "refunded", labelEn: "Refunded", labelBn: "\u09B0\u09BF\u09AB\u09BE\u09A8\u09CD\u09A1\u09C7\u09A1", color: "#059669" }
    ];
    return statuses.map((s) => {
      const matching = inRangeOrders.filter((o) => o.status === s.key);
      const count = matching.length;
      const value = matching.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        status: s.key,
        labelEn: s.labelEn,
        labelBn: s.labelBn,
        count,
        value,
        color: s.color
      };
    });
  }
  getTopSellingProducts(range = "all_time", category, limit = 10) {
    const { start, end } = this.getDateFilterBounds(range);
    const inRangeOrders = this.data.orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= start && t <= end && o.status !== "cancelled";
    });
    const productStats = /* @__PURE__ */ new Map();
    inRangeOrders.forEach((o) => {
      o.items.forEach((item) => {
        const prod = this.data.products.find((p) => p.id === item.productId);
        if (category && category !== "all" && prod && prod.categorySlug !== category && prod.type !== category) {
          return;
        }
        const existing = productStats.get(item.productId);
        if (existing) {
          existing.unitsSold += item.quantity;
          existing.qualifyingOrdersCount += 1;
          existing.grossSales += item.lineSubtotal;
        } else {
          productStats.set(item.productId, {
            productId: item.productId,
            nameEn: prod?.nameEn || item.productName,
            nameBn: prod?.nameBn || item.productName,
            imageUrl: prod?.imageUrl || item.imageUrl || "",
            sku: prod?.SKU || item.productId,
            categorySlug: prod?.categorySlug || "general",
            type: prod?.type || "plant",
            unitsSold: item.quantity,
            qualifyingOrdersCount: 1,
            grossSales: item.lineSubtotal
          });
        }
      });
    });
    return Array.from(productStats.values()).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, limit);
  }
  getInventoryAlerts(threshold = 10) {
    return this.data.products.map((p) => {
      let stockStatus;
      if (p.stockQuantity === 0) {
        stockStatus = "out_of_stock";
      } else if (p.stockQuantity <= threshold) {
        stockStatus = "low_stock";
      } else {
        stockStatus = "healthy_stock";
      }
      return {
        productId: p.id,
        nameEn: p.nameEn,
        nameBn: p.nameBn,
        imageUrl: p.imageUrl,
        sku: p.SKU,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: threshold,
        categorySlug: p.categorySlug,
        type: p.type,
        stockStatus
      };
    });
  }
  exportAnalyticsCsv(type, range = "all_time") {
    const escape = (val) => {
      let s = String(val ?? "").replace(/"/g, '""');
      if (s.startsWith("=") || s.startsWith("+") || s.startsWith("-") || s.startsWith("@")) {
        s = `'${s}`;
      }
      return `"${s}"`;
    };
    if (type === "top_products") {
      const products = this.getTopSellingProducts(range, void 0, 100);
      const headers2 = ["Product ID", "Name (English)", "Name (Bengali)", "SKU", "Units Sold", "Orders Count", "Gross Sales (BDT)"];
      const rows2 = products.map((p) => [
        escape(p.productId),
        escape(p.nameEn),
        escape(p.nameBn),
        escape(p.sku),
        escape(p.unitsSold),
        escape(p.qualifyingOrdersCount),
        escape(p.grossSales)
      ]);
      return "\uFEFF" + [headers2.map(escape).join(","), ...rows2.map((r) => r.join(","))].join("\n");
    }
    if (type === "inventory_alerts") {
      const items = this.getInventoryAlerts();
      const headers2 = ["Product ID", "Name", "SKU", "Category", "Available Stock", "Status"];
      const rows2 = items.map((i) => [
        escape(i.productId),
        escape(i.nameEn),
        escape(i.sku),
        escape(i.categorySlug),
        escape(i.stockQuantity),
        escape(i.stockStatus.toUpperCase())
      ]);
      return "\uFEFF" + [headers2.map(escape).join(","), ...rows2.map((r) => r.join(","))].join("\n");
    }
    const metrics = this.getDashboardMetrics(range);
    const headers = ["Metric Label (English)", "Metric Label (Bengali)", "Calculated Value"];
    const rows = [
      [escape("Total Orders"), escape("\u09AE\u09CB\u099F \u0985\u09B0\u09CD\u09A1\u09BE\u09B0"), escape(metrics.totalOrders)],
      [escape("Pending Orders"), escape("\u09A8\u09A4\u09C1\u09A8 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0"), escape(metrics.pendingOrders)],
      [escape("Confirmed Orders"), escape("\u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0"), escape(metrics.confirmedOrders)],
      [escape("Processing Orders"), escape("\u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u09B9\u099A\u09CD\u099B\u09C7"), escape(metrics.processingOrders)],
      [escape("Shipped Orders"), escape("\u09B6\u09BF\u09AA\u09A1"), escape(metrics.shippedOrders)],
      [escape("Delivered Orders"), escape("\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09CD\u09A1"), escape(metrics.deliveredOrders)],
      [escape("Cancelled Orders"), escape("\u09AC\u09BE\u09A4\u09BF\u09B2"), escape(metrics.cancelledOrders)],
      [escape("Gross Order Value (BDT)"), escape("\u09AE\u09CB\u099F \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF"), escape(metrics.totalOrderValue)],
      [escape("Delivered Order Value (BDT)"), escape("\u09B8\u09AB\u09B2 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AC\u09BF\u0995\u09CD\u09B0\u09DF"), escape(metrics.deliveredOrderValue)],
      [escape("Actual Collected Payments (BDT)"), escape("\u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u0995\u09CD\u09AF\u09BE\u09B6/\u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F"), escape(metrics.actualCollectedPayments)],
      [escape("Outstanding COD (BDT)"), escape("\u09AC\u0995\u09C7\u09DF\u09BE \u0995\u09CD\u09AF\u09BE\u09B6-\u0985\u09A8-\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF"), escape(metrics.outstandingCod)],
      [escape("Verified Refunds (BDT)"), escape("\u09B0\u09BF\u09AB\u09BE\u09A8\u09CD\u09A1\u0995\u09C3\u09A4 \u099F\u09BE\u0995\u09BE"), escape(metrics.totalRefunds)],
      [escape("Net Sales (BDT)"), escape("\u09A8\u09C7\u099F \u09AC\u09BF\u0995\u09CD\u09B0\u09DF"), escape(metrics.netSales)],
      [escape("Average Order Value (BDT)"), escape("\u0997\u09DC \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AE\u09C2\u09B2\u09CD\u09AF"), escape(metrics.averageOrderValue)],
      [escape("Profit Data"), escape("\u09AA\u09CD\u09B0\u09AB\u09BF\u099F \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BE\u09B8"), escape(metrics.profitStatus)]
    ];
    return "\uFEFF" + [headers.map(escape).join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
};
var db = new DatabaseService();

// server/controllers/authController.ts
var DUMMY_HASH = "$2a$10$wN3f3V6V6m3GZfP3nF9C7.eXU6Q4x7I0hF9F1aZ9rO.pM8WkKzJm.";
var authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({
          success: false,
          error: "Email and password are required"
        });
        return;
      }
      const trimmedEmail = email.trim().toLowerCase();
      const user = db.findUserByEmail(trimmedEmail);
      const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
      const isMatch = await bcrypt2.compare(password, hashToCompare);
      if (!user || !isMatch) {
        res.status(401).json({
          success: false,
          error: "Invalid email or password combination."
        });
        return;
      }
      if (!user.isActive) {
        res.status(403).json({
          success: false,
          error: "Your administrator account has been deactivated. Please contact Hasna Hena."
        });
        return;
      }
      db.updateUserLastLogin(user.id);
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      const signOptions = {
        expiresIn: "7d"
      };
      const token = jwt.sign(payload, ENV.JWT_SECRET, signOptions);
      const response = {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            lastLogin: (/* @__PURE__ */ new Date()).toISOString()
          }
        },
        message: "Login successful"
      };
      res.json(response);
    } catch {
      res.status(500).json({
        success: false,
        error: "An unexpected authentication error occurred"
      });
    }
  },
  getCurrentUser: (req, res) => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const user = db.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin
      }
    });
  }
};

// server/middleware/auth.ts
import jwt2 from "jsonwebtoken";
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Authentication token required (Unauthorized)"
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt2.verify(token, ENV.JWT_SECRET);
    const user = db.findUserById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: "User account not found or deactivated"
      });
      return;
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "Invalid or expired authentication token"
    });
  }
}

// server/middleware/security.ts
import rateLimit from "express-rate-limit";
var authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes window
  max: 10,
  // Max 10 login attempts per IP per window
  standardHeaders: true,
  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: "Too many authentication attempts from this IP address. Please try again after 15 minutes.",
    retryAfterMinutes: 15
  }
});
var orderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 20,
  // Max 20 orders per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Order placement rate limit reached. Please wait a few moments before submitting another order."
  }
});
var apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 1e3,
  // Max 1000 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "API rate limit exceeded. Please throttle your requests."
  }
});
function securityHeadersMiddleware(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}
function sanitizeValue(value) {
  if (typeof value === "string") {
    return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/javascript:/gi, "").replace(/onload=/gi, "").replace(/onerror=/gi, "").trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value !== null && typeof value === "object") {
    const cleanObj = {};
    for (const [key, val] of Object.entries(value)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }
      cleanObj[key] = sanitizeValue(val);
    }
    return cleanObj;
  }
  return value;
}
function inputSanitizationMiddleware(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeValue(req.query);
  }
  next();
}

// server/routes/authRoutes.ts
var router = Router();
router.post("/login", authRateLimiter, authController.login);
router.get("/me", authenticateAdmin, authController.getCurrentUser);
var authRoutes_default = router;

// server/routes/productRoutes.ts
import { Router as Router2 } from "express";

// server/controllers/productController.ts
var productController = {
  getProducts: (req, res) => {
    try {
      const { category, type, search, inStock, publishedOnly } = req.query;
      const products = db.getProducts({
        category: typeof category === "string" ? category : void 0,
        type: typeof type === "string" ? type : void 0,
        search: typeof search === "string" ? search : void 0,
        inStockOnly: inStock === "true",
        publishedOnly: publishedOnly !== "false"
      });
      const response = {
        success: true,
        data: products,
        meta: {
          total: products.length,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve products" });
    }
  },
  getProductById: (req, res) => {
    try {
      const { id } = req.params;
      const product = db.getProductById(id);
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve product" });
    }
  },
  createProduct: (req, res) => {
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
        imageUrl
      } = req.body;
      if (!nameEn || !nameBn || !type || !price || !SKU) {
        res.status(400).json({
          success: false,
          error: "Required fields: nameEn, nameBn, type, price, SKU"
        });
        return;
      }
      const slug = (req.body.slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");
      const newProduct = db.createProduct({
        slug,
        SKU,
        type,
        category: category || "Plants",
        categorySlug: categorySlug || "indoor-plants",
        nameEn,
        nameBn,
        botanicalName: req.body.botanicalName || "",
        descriptionEn: req.body.descriptionEn || "",
        descriptionBn: req.body.descriptionBn || "",
        price: Number(price),
        originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : void 0,
        discountPercent: req.body.discountPercent ? Number(req.body.discountPercent) : 0,
        stockQuantity: Number(stockQuantity) || 0,
        inStock: Number(stockQuantity) > 0,
        isFeatured: Boolean(req.body.isFeatured),
        isBestseller: Boolean(req.body.isBestseller),
        isPublished: req.body.isPublished !== void 0 ? Boolean(req.body.isPublished) : true,
        rating: 5,
        reviewsCount: 0,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
        images: req.body.images || [imageUrl || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800"],
        indoorOutdoor: req.body.indoorOutdoor || "both",
        packetSizeEn: req.body.packetSizeEn,
        packetSizeBn: req.body.packetSizeBn,
        plantHeightEn: req.body.plantHeightEn,
        plantHeightBn: req.body.plantHeightBn,
        plantAgeEn: req.body.plantAgeEn,
        plantAgeBn: req.body.plantAgeBn,
        sunlightEn: req.body.sunlightEn || "Indirect light",
        sunlightBn: req.body.sunlightBn || "\u09AA\u09B0\u09CB\u0995\u09CD\u09B7 \u0986\u09B2\u09CB",
        waterEn: req.body.waterEn || "Regular moisture",
        waterBn: req.body.waterBn || "\u09AA\u09B0\u09BF\u09AE\u09BF\u09A4 \u099C\u09B2",
        soilTypeEn: req.body.soilTypeEn,
        soilTypeBn: req.body.soilTypeBn,
        plantingSeasonEn: req.body.plantingSeasonEn,
        plantingSeasonBn: req.body.plantingSeasonBn,
        tagsEn: req.body.tagsEn || [],
        tagsBn: req.body.tagsBn || []
      });
      res.status(201).json({
        success: true,
        data: newProduct,
        message: "Product created successfully"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to create product" });
    }
  },
  updateProduct: (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateProduct(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({
        success: true,
        data: updated,
        message: "Product updated successfully"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to update product" });
    }
  },
  deleteProduct: (req, res) => {
    try {
      const { id } = req.params;
      const success = db.deleteProduct(id);
      if (!success) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to delete product" });
    }
  }
};

// server/routes/productRoutes.ts
var router2 = Router2();
router2.get("/", productController.getProducts);
router2.get("/:id", productController.getProductById);
router2.post("/", authenticateAdmin, productController.createProduct);
router2.put("/:id", authenticateAdmin, productController.updateProduct);
router2.delete("/:id", authenticateAdmin, productController.deleteProduct);
var productRoutes_default = router2;

// server/routes/categoryRoutes.ts
import { Router as Router3 } from "express";

// server/controllers/categoryController.ts
var categoryController = {
  getCategories: (_req, res) => {
    try {
      const categories = db.getCategories();
      const response = {
        success: true,
        data: categories
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve categories" });
    }
  },
  createCategory: (req, res) => {
    try {
      const { nameEn, nameBn, type, descriptionEn, descriptionBn, imageUrl } = req.body;
      if (!nameEn || !nameBn || !type) {
        res.status(400).json({ success: false, error: "nameEn, nameBn, and type are required" });
        return;
      }
      const slug = (req.body.slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");
      const newCat = db.createCategory({
        slug,
        type,
        nameEn,
        nameBn,
        descriptionEn: descriptionEn || "",
        descriptionBn: descriptionBn || "",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800",
        isActive: true,
        itemCount: 0
      });
      res.status(201).json({ success: true, data: newCat, message: "Category created" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to create category" });
    }
  },
  updateCategory: (req, res) => {
    try {
      const { id } = req.params;
      const updated = db.updateCategory(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: "Category not found" });
        return;
      }
      res.json({ success: true, data: updated, message: "Category updated" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to update category" });
    }
  },
  deleteCategory: (req, res) => {
    try {
      const { id } = req.params;
      const deleted = db.deleteCategory(id);
      if (!deleted) {
        res.status(404).json({ success: false, error: "Category not found" });
        return;
      }
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to delete category" });
    }
  }
};

// server/routes/categoryRoutes.ts
var router3 = Router3();
router3.get("/", categoryController.getCategories);
router3.post("/", authenticateAdmin, categoryController.createCategory);
router3.put("/:id", authenticateAdmin, categoryController.updateCategory);
router3.delete("/:id", authenticateAdmin, categoryController.deleteCategory);
var categoryRoutes_default = router3;

// server/routes/orderRoutes.ts
import { Router as Router4 } from "express";

// server/utils/orderLifecycle.ts
var ORDER_STATUS_REGISTRY = {
  pending: {
    key: "pending",
    labelEn: "Pending",
    labelBn: "\u09A8\u09A4\u09C1\u09A8 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0",
    color: "#D97706",
    bgColor: "#FEF3C7",
    borderColor: "#FCD34D"
  },
  confirmed: {
    key: "confirmed",
    labelEn: "Confirmed",
    labelBn: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4",
    color: "#2563EB",
    bgColor: "#DBEAFE",
    borderColor: "#93C5FD"
  },
  processing: {
    key: "processing",
    labelEn: "Processing",
    labelBn: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B8\u09CD\u09A4\u09C1\u09A4 \u09B9\u099A\u09CD\u099B\u09C7",
    color: "#7C3AED",
    bgColor: "#EDE9FE",
    borderColor: "#C4B5FD"
  },
  packed: {
    key: "packed",
    labelEn: "Packed",
    labelBn: "\u09AA\u09A3\u09CD\u09AF \u09AA\u09CD\u09AF\u09BE\u0995 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7",
    color: "#0D9488",
    bgColor: "#CCFBF1",
    borderColor: "#5EEAD4"
  },
  shipped: {
    key: "shipped",
    labelEn: "Shipped",
    labelBn: "\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09B0 \u099C\u09A8\u09CD\u09AF \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09DF\u09C7\u099B\u09C7",
    color: "#0284C7",
    bgColor: "#E0F2FE",
    borderColor: "#7DD3FC"
  },
  delivered: {
    key: "delivered",
    labelEn: "Delivered",
    labelBn: "\u09AA\u09A3\u09CD\u09AF \u09AA\u09CC\u0981\u099B\u09C7 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09DF\u09C7\u099B\u09C7",
    color: "#15803D",
    bgColor: "#DCFCE7",
    borderColor: "#86EFAC"
  },
  cancelled: {
    key: "cancelled",
    labelEn: "Cancelled",
    labelBn: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AC\u09BE\u09A4\u09BF\u09B2",
    color: "#DC2626",
    bgColor: "#FEE2E2",
    borderColor: "#FCA5A5"
  },
  return_requested: {
    key: "return_requested",
    labelEn: "Return Requested",
    labelBn: "\u09B0\u09BF\u099F\u09BE\u09B0\u09CD\u09A8\u09C7\u09B0 \u0985\u09A8\u09C1\u09B0\u09CB\u09A7",
    color: "#C026D3",
    bgColor: "#FAE8FF",
    borderColor: "#F0ABFC"
  },
  returned: {
    key: "returned",
    labelEn: "Returned",
    labelBn: "\u09AA\u09A3\u09CD\u09AF \u09AB\u09C7\u09B0\u09A4 \u098F\u09B8\u09C7\u099B\u09C7",
    color: "#4B5563",
    bgColor: "#F3F4F6",
    borderColor: "#D1D5DB"
  },
  refunded: {
    key: "refunded",
    labelEn: "Refunded",
    labelBn: "\u099F\u09BE\u0995\u09BE \u09AB\u09C7\u09B0\u09A4 \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u09DF\u09C7\u099B\u09C7",
    color: "#059669",
    bgColor: "#D1FAE5",
    borderColor: "#6EE7B7"
  }
};
var ALLOWED_STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  // returned on delivery failure / RTO
  delivered: ["return_requested"],
  return_requested: ["returned", "delivered"],
  // returned if accepted, back to delivered if rejected
  returned: ["refunded"],
  cancelled: [],
  // Final state
  refunded: []
  // Final state
};
function isValidTransition(current, target, userRole) {
  if (current === target) {
    return { allowed: false, reason: "Order is already in this status." };
  }
  if (userRole === "superadmin" && current !== "refunded") {
    return { allowed: true };
  }
  const allowedNext = ALLOWED_STATUS_TRANSITIONS[current] || [];
  if (!allowedNext.includes(target)) {
    const validNames = allowedNext.map((s) => ORDER_STATUS_REGISTRY[s]?.labelEn).join(", ") || "None (Terminal state)";
    return {
      allowed: false,
      reason: `Cannot transition order directly from "${ORDER_STATUS_REGISTRY[current]?.labelEn}" to "${ORDER_STATUS_REGISTRY[target]?.labelEn}". Allowed next states: ${validNames}.`
    };
  }
  return { allowed: true };
}

// server/controllers/orderController.ts
var orderController = {
  getOrders: (req, res) => {
    try {
      const {
        status,
        paymentStatus,
        paymentMethod,
        deliveryArea,
        startDate,
        endDate,
        search,
        sortBy,
        page,
        limit
      } = req.query;
      const result = db.getOrders({
        status: typeof status === "string" ? status : void 0,
        paymentStatus: typeof paymentStatus === "string" ? paymentStatus : void 0,
        paymentMethod: typeof paymentMethod === "string" ? paymentMethod : void 0,
        deliveryArea: typeof deliveryArea === "string" ? deliveryArea : void 0,
        startDate: typeof startDate === "string" ? startDate : void 0,
        endDate: typeof endDate === "string" ? endDate : void 0,
        search: typeof search === "string" ? search : void 0,
        sortBy: typeof sortBy === "string" ? sortBy : void 0,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 50
      });
      const response = {
        success: true,
        data: result.orders,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      };
      res.json(response);
    } catch {
      res.status(500).json({ success: false, error: "Failed to retrieve orders" });
    }
  },
  getOrderById: (req, res) => {
    try {
      const { id } = req.params;
      const order = db.getOrderById(id);
      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      res.json({ success: true, data: order });
    } catch {
      res.status(500).json({ success: false, error: "Failed to retrieve order" });
    }
  },
  /**
   * Public Order Tracking Endpoint (IDOR Protected).
   */
  trackOrder: (req, res) => {
    try {
      const { orderNumber, mobileNumber } = req.body;
      if (!orderNumber || !mobileNumber) {
        res.status(400).json({
          success: false,
          error: "Both Order Number and Customer Mobile Number are required for tracking."
        });
        return;
      }
      const order = db.getOrderById(orderNumber.trim());
      if (!order) {
        res.status(404).json({
          success: false,
          error: "No order found matching the provided order number and phone credentials."
        });
        return;
      }
      const cleanPhone = mobileNumber.replace(/\D/g, "").slice(-11);
      const orderPhone = order.customer.mobileNumber.replace(/\D/g, "").slice(-11);
      if (cleanPhone !== orderPhone) {
        res.status(403).json({
          success: false,
          error: "Security verification failed: Mobile number does not match this order record."
        });
        return;
      }
      res.json({
        success: true,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          deliveryMethod: order.deliveryMethod,
          deliveryProvider: order.deliveryProvider,
          trackingNumber: order.trackingNumber,
          dispatchDate: order.dispatchDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          actualDeliveryDate: order.actualDeliveryDate,
          items: order.items,
          subtotal: order.subtotal,
          deliveryCharge: order.deliveryCharge,
          totalAmount: order.totalAmount,
          customer: {
            fullName: order.customer.fullName,
            district: order.customer.district,
            division: order.customer.division
          },
          statusHistory: order.statusHistory,
          createdAt: order.createdAt
        }
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to track order" });
    }
  },
  createOrder: (req, res) => {
    try {
      const { customer, items, deliveryMethod, paymentMethod, adminNotes } = req.body;
      if (!customer || !customer.fullName || !customer.mobileNumber || !items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({
          success: false,
          error: "Customer name, 11-digit mobile number, and valid order items are strictly required."
        });
        return;
      }
      const phoneDigits = customer.mobileNumber.replace(/\D/g, "");
      if (phoneDigits.length < 11) {
        res.status(400).json({
          success: false,
          error: "Please provide a valid 11-digit Bangladeshi mobile number."
        });
        return;
      }
      let verifiedSubtotal = 0;
      const verifiedItems = [];
      for (const item of items) {
        const qty = parseInt(String(item.quantity), 10);
        if (isNaN(qty) || qty <= 0) {
          res.status(400).json({
            success: false,
            error: `Invalid quantity for item: ${item.productId || "unknown"}`
          });
          return;
        }
        const product = db.getProductById(item.productId);
        if (!product) {
          res.status(400).json({
            success: false,
            error: `Product not found or unavailable: ${item.productId}`
          });
          return;
        }
        if (product.isPublished === false) {
          res.status(400).json({
            success: false,
            error: `Product is currently unavailable: ${product.nameEn}`
          });
          return;
        }
        if (product.stockQuantity < qty) {
          res.status(400).json({
            success: false,
            error: `Insufficient stock for ${product.nameEn}. Available stock: ${product.stockQuantity}, Requested: ${qty}`
          });
          return;
        }
        const serverUnitPrice = product.price;
        const lineSubtotal = serverUnitPrice * qty;
        verifiedSubtotal += lineSubtotal;
        verifiedItems.push({
          productId: product.id,
          productName: product.nameEn,
          slug: product.slug,
          imageUrl: product.imageUrl,
          quantity: qty,
          unitPrice: serverUnitPrice,
          lineSubtotal
        });
      }
      const isInsideDhaka = customer.division?.toLowerCase().includes("dhaka") || customer.district?.toLowerCase().includes("dhaka");
      const verifiedDeliveryCharge = isInsideDhaka ? 60 : 120;
      const verifiedTotalAmount = verifiedSubtotal + verifiedDeliveryCharge;
      const safePaymentMethod = paymentMethod === "online-bkash" ? "online-bkash" : "cash-on-delivery";
      const newOrder = db.createOrder({
        customer: {
          fullName: customer.fullName.trim(),
          mobileNumber: customer.mobileNumber.trim(),
          email: customer.email ? customer.email.trim() : void 0,
          division: customer.division || (isInsideDhaka ? "Dhaka" : "Outside Dhaka"),
          district: customer.district || (isInsideDhaka ? "Dhaka" : "Outside Dhaka"),
          upazila: customer.upazila || "",
          addressDetail: customer.addressDetail || "",
          deliveryInstructions: customer.deliveryInstructions || ""
        },
        items: verifiedItems,
        subtotal: verifiedSubtotal,
        deliveryCharge: verifiedDeliveryCharge,
        discountAmount: 0,
        totalAmount: verifiedTotalAmount,
        deliveryMethod: deliveryMethod || "home-delivery",
        paymentMethod: safePaymentMethod,
        adminNotes
      });
      res.status(201).json({
        success: true,
        data: newOrder,
        message: "Order created and verified successfully."
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  },
  updateStatus: (req, res) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const existingOrder = db.getOrderById(id);
      if (!existingOrder) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      const targetStatus = status;
      const transitionCheck = isValidTransition(existingOrder.status, targetStatus, req.user?.role);
      if (!transitionCheck.allowed) {
        res.status(400).json({
          success: false,
          error: transitionCheck.reason || "Invalid order status transition."
        });
        return;
      }
      const performedBy = req.user?.name || "Administrator";
      const result = db.updateOrderStatus(id, targetStatus, note, performedBy);
      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || "Failed to update order status" });
        return;
      }
      res.json({
        success: true,
        data: result.order,
        message: `Order status changed from ${existingOrder.status} to ${targetStatus}`
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to update order status" });
    }
  },
  updatePaymentStatus: (req, res) => {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;
      const validPayments = ["unpaid", "pending", "paid", "partially_refunded", "refunded", "failed"];
      if (!validPayments.includes(paymentStatus)) {
        res.status(400).json({
          success: false,
          error: `Invalid payment status. Must be one of: ${validPayments.join(", ")}`
        });
        return;
      }
      const performedBy = req.user?.name || "Administrator";
      const updated = db.updateOrderPaymentStatus(id, paymentStatus, performedBy);
      if (!updated) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      res.json({
        success: true,
        data: updated,
        message: `Payment status updated to ${paymentStatus}`
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to update payment status" });
    }
  },
  updateDelivery: (req, res) => {
    try {
      const { id } = req.params;
      const {
        deliveryProvider,
        trackingNumber,
        dispatchDate,
        expectedDeliveryDate,
        deliveryNotes
      } = req.body;
      const performedBy = req.user?.name || "Administrator";
      const updated = db.updateOrderDelivery(
        id,
        {
          deliveryProvider,
          trackingNumber,
          dispatchDate,
          expectedDeliveryDate,
          deliveryNotes
        },
        performedBy
      );
      if (!updated) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }
      res.json({
        success: true,
        data: updated,
        message: "Delivery and courier tracking details updated successfully"
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to update delivery info" });
    }
  },
  recordCodCollection: (req, res) => {
    try {
      const { id } = req.params;
      const { collectedAmount, collectedByStaff, note } = req.body;
      const performedBy = req.user?.name || "Administrator";
      const result = db.recordCodCollection(
        id,
        {
          collectedAmount: Number(collectedAmount),
          collectedByStaff: collectedByStaff || performedBy,
          note
        },
        performedBy
      );
      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || "Failed to record COD collection" });
        return;
      }
      res.json({
        success: true,
        data: result.order,
        message: "COD payment collection verified and recorded in audit trail"
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to record COD collection" });
    }
  },
  processReturn: (req, res) => {
    try {
      const { id } = req.params;
      const { action, reason, returnedQuantities, restoreToStock } = req.body;
      if (!["request", "approve", "reject"].includes(action)) {
        res.status(400).json({ success: false, error: "Action must be one of: request, approve, reject" });
        return;
      }
      const performedBy = req.user?.name || "Administrator";
      const result = db.processOrderReturn(
        id,
        {
          action,
          reason,
          returnedQuantities,
          restoreToStock: Boolean(restoreToStock)
        },
        performedBy
      );
      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || "Failed to process return" });
        return;
      }
      res.json({
        success: true,
        data: result.order,
        message: `Order return ${action} completed successfully`
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to process order return" });
    }
  },
  recordRefund: (req, res) => {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;
      if (!amount || !reason) {
        res.status(400).json({ success: false, error: "Refund amount and reason are required" });
        return;
      }
      const performedBy = req.user?.name || "Administrator";
      const result = db.recordOrderRefund(
        id,
        {
          amount: Number(amount),
          reason
        },
        performedBy
      );
      if (!result.success || !result.order) {
        res.status(400).json({ success: false, error: result.error || "Failed to record refund" });
        return;
      }
      res.json({
        success: true,
        data: result.order,
        message: "Refund recorded and reflected in order totals"
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to record refund" });
    }
  },
  exportCsv: (_req, res) => {
    try {
      const { orders } = db.getOrders({ limit: 5e3 });
      const headers = [
        "Order Number",
        "Date",
        "Customer Name",
        "Mobile Number",
        "District",
        "Items Count",
        "Subtotal (BDT)",
        "Delivery Charge (BDT)",
        "Total Amount (BDT)",
        "Payment Method",
        "Payment Status",
        "Order Status",
        "Courier Provider",
        "Tracking Number",
        "COD Collected (BDT)"
      ];
      const escapeCell = (val) => {
        let str = String(val ?? "").replace(/"/g, '""');
        if (str.startsWith("=") || str.startsWith("+") || str.startsWith("-") || str.startsWith("@")) {
          str = `'${str}`;
        }
        return `"${str}"`;
      };
      const rows = orders.map((o) => [
        escapeCell(o.orderNumber),
        escapeCell(new Date(o.createdAt).toLocaleDateString("en-GB")),
        escapeCell(o.customer.fullName),
        escapeCell(o.customer.mobileNumber),
        escapeCell(o.customer.district),
        escapeCell(o.items.length),
        escapeCell(o.subtotal),
        escapeCell(o.deliveryCharge),
        escapeCell(o.totalAmount),
        escapeCell(o.paymentMethod),
        escapeCell(o.paymentStatus),
        escapeCell(o.status),
        escapeCell(o.deliveryProvider || "N/A"),
        escapeCell(o.trackingNumber || "N/A"),
        escapeCell(o.codCollectedAmount || 0)
      ]);
      const csvContent = "\uFEFF" + [headers.map(escapeCell).join(","), ...rows.map((r) => r.join(","))].join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename=gardenvaly-orders-${Date.now()}.csv`);
      res.send(csvContent);
    } catch {
      res.status(500).json({ success: false, error: "Failed to export orders" });
    }
  }
};

// server/routes/orderRoutes.ts
var router4 = Router4();
router4.post("/", orderRateLimiter, orderController.createOrder);
router4.post("/track", orderRateLimiter, orderController.trackOrder);
router4.get("/export/csv", authenticateAdmin, orderController.exportCsv);
router4.get("/", authenticateAdmin, orderController.getOrders);
router4.get("/:id", authenticateAdmin, orderController.getOrderById);
router4.patch("/:id/status", authenticateAdmin, orderController.updateStatus);
router4.patch("/:id/payment", authenticateAdmin, orderController.updatePaymentStatus);
router4.patch("/:id/delivery", authenticateAdmin, orderController.updateDelivery);
router4.patch("/:id/cod-reconcile", authenticateAdmin, orderController.recordCodCollection);
router4.patch("/:id/return", authenticateAdmin, orderController.processReturn);
router4.patch("/:id/refund", authenticateAdmin, orderController.recordRefund);
var orderRoutes_default = router4;

// server/routes/inventoryRoutes.ts
import { Router as Router5 } from "express";

// server/controllers/inventoryController.ts
var inventoryController = {
  getAdjustments: (_req, res) => {
    try {
      const logs = db.getInventoryAdjustments();
      const response = {
        success: true,
        data: logs
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve inventory logs" });
    }
  },
  adjustStock: (req, res) => {
    try {
      const { productId, quantityChanged, reason } = req.body;
      if (!productId || quantityChanged === void 0 || !reason) {
        res.status(400).json({
          success: false,
          error: "productId, quantityChanged, and reason are required"
        });
        return;
      }
      const adminName = req.user?.name || "Administrator";
      const updated = db.adjustStock(productId, Number(quantityChanged), reason, adminName);
      if (!updated) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({
        success: true,
        data: updated,
        message: "Stock adjusted successfully and audit logged"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to adjust stock" });
    }
  }
};

// server/routes/inventoryRoutes.ts
var router5 = Router5();
router5.get("/adjustments", authenticateAdmin, inventoryController.getAdjustments);
router5.post("/adjust", authenticateAdmin, inventoryController.adjustStock);
var inventoryRoutes_default = router5;

// server/routes/customerRoutes.ts
import { Router as Router6 } from "express";

// server/controllers/customerController.ts
var customerController = {
  getCustomers: (_req, res) => {
    try {
      const customers = db.getCustomers();
      const response = {
        success: true,
        data: customers,
        meta: { total: customers.length }
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve customers" });
    }
  },
  getCustomerById: (req, res) => {
    try {
      const { id } = req.params;
      const customer = db.getCustomerById(id);
      if (!customer) {
        res.status(404).json({ success: false, error: "Customer not found" });
        return;
      }
      res.json({ success: true, data: customer });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve customer" });
    }
  }
};

// server/routes/customerRoutes.ts
var router6 = Router6();
router6.get("/", authenticateAdmin, customerController.getCustomers);
router6.get("/:id", authenticateAdmin, customerController.getCustomerById);
var customerRoutes_default = router6;

// server/routes/settingsRoutes.ts
import { Router as Router7 } from "express";

// server/controllers/settingsController.ts
var settingsController = {
  getSettings: (_req, res) => {
    try {
      const settings = db.getSettings();
      const response = {
        success: true,
        data: settings
      };
      res.json(response);
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to retrieve settings" });
    }
  },
  updateSettings: (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json({
        success: true,
        data: updated,
        message: "Store settings updated successfully"
      });
    } catch (err) {
      res.status(500).json({ success: false, error: "Failed to update settings" });
    }
  }
};

// server/routes/settingsRoutes.ts
var router7 = Router7();
router7.get("/", settingsController.getSettings);
router7.put("/", authenticateAdmin, settingsController.updateSettings);
var settingsRoutes_default = router7;

// server/routes/reportsRoutes.ts
import { Router as Router8 } from "express";

// server/controllers/reportsController.ts
var reportsController = {
  getDashboardMetrics: (req, res) => {
    try {
      const { range, customStart, customEnd } = req.query;
      const metrics = db.getDashboardMetrics(
        typeof range === "string" ? range : "all_time",
        typeof customStart === "string" ? customStart : void 0,
        typeof customEnd === "string" ? customEnd : void 0
      );
      const response = {
        success: true,
        data: metrics
      };
      res.json(response);
    } catch {
      res.status(500).json({ success: false, error: "Failed to calculate dashboard metrics" });
    }
  },
  getSalesTrend: (req, res) => {
    try {
      const { range } = req.query;
      const trend = db.getSalesTrend(typeof range === "string" ? range : "last_30_days");
      res.json({
        success: true,
        data: trend
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to calculate sales trend" });
    }
  },
  getStatusDistribution: (req, res) => {
    try {
      const { range } = req.query;
      const distribution = db.getStatusDistribution(typeof range === "string" ? range : "all_time");
      res.json({
        success: true,
        data: distribution
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to calculate status distribution" });
    }
  },
  getTopSellingProducts: (req, res) => {
    try {
      const { range, category, limit } = req.query;
      const topProducts = db.getTopSellingProducts(
        typeof range === "string" ? range : "all_time",
        typeof category === "string" ? category : void 0,
        limit ? parseInt(String(limit), 10) : 10
      );
      res.json({
        success: true,
        data: topProducts
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to retrieve top selling products" });
    }
  },
  getInventoryAlerts: (req, res) => {
    try {
      const { threshold } = req.query;
      const alerts = db.getInventoryAlerts(threshold ? parseInt(String(threshold), 10) : 10);
      res.json({
        success: true,
        data: alerts
      });
    } catch {
      res.status(500).json({ success: false, error: "Failed to retrieve inventory alerts" });
    }
  },
  exportCsv: (req, res) => {
    try {
      const { type, range } = req.query;
      const reportType = typeof type === "string" ? type : "summary";
      const selectedRange = typeof range === "string" ? range : "all_time";
      const csvContent = db.exportAnalyticsCsv(reportType, selectedRange);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=gardenvaly-${reportType}-${selectedRange}-${Date.now()}.csv`
      );
      res.send(csvContent);
    } catch {
      res.status(500).json({ success: false, error: "Failed to export analytics CSV" });
    }
  }
};

// server/routes/reportsRoutes.ts
var router8 = Router8();
router8.get("/dashboard", authenticateAdmin, reportsController.getDashboardMetrics);
router8.get("/metrics", authenticateAdmin, reportsController.getDashboardMetrics);
router8.get("/sales-trend", authenticateAdmin, reportsController.getSalesTrend);
router8.get("/status-distribution", authenticateAdmin, reportsController.getStatusDistribution);
router8.get("/top-products", authenticateAdmin, reportsController.getTopSellingProducts);
router8.get("/inventory-alerts", authenticateAdmin, reportsController.getInventoryAlerts);
router8.get("/export/csv", authenticateAdmin, reportsController.exportCsv);
router8.get("/", authenticateAdmin, reportsController.getDashboardMetrics);
var reportsRoutes_default = router8;

// server/routes/index.ts
var apiRouter = Router9();
apiRouter.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Gardenvaly API is running smoothly",
    brand: "Gardenvaly by Hasna Hena",
    environment: ENV.NODE_ENV,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.use("/auth", authRoutes_default);
apiRouter.use("/products", productRoutes_default);
apiRouter.use("/categories", categoryRoutes_default);
apiRouter.use("/orders", orderRoutes_default);
apiRouter.use("/inventory", inventoryRoutes_default);
apiRouter.use("/customers", customerRoutes_default);
apiRouter.use("/settings", settingsRoutes_default);
apiRouter.use("/reports", reportsRoutes_default);
apiRouter.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});
var routes_default = apiRouter;

// server/middleware/errorHandler.ts
function errorHandler(err, _req, res, _next) {
  console.error("[API Error]", err.name, err.message);
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const safeErrorMessage = isProduction && statusCode === 500 ? "An internal server error occurred. Please contact Gardenvaly support." : err.message || "Internal Server Error";
  const response = {
    success: false,
    error: safeErrorMessage
  };
  res.status(statusCode).json(response);
}

// server.ts
import fs2 from "fs";

// server/services/seoService.ts
var BRAND_NAME = "Gardenvaly";
var BRAND_SIGNATURE = "by Hasna Hena";
var DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&h=630&q=85";
function escapeXml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
var SeoService = class {
  /**
   * Determine the absolute base URL based on environment or incoming request.
   */
  getBaseUrl(req) {
    const envAppUrl = process.env.APP_URL;
    if (envAppUrl && envAppUrl !== "MY_APP_URL" && envAppUrl.startsWith("http")) {
      return envAppUrl.replace(/\/+$/, "");
    }
    if (req && req.get) {
      const host = req.get("host");
      const proto = req.protocol || "http";
      if (host) {
        return `${proto}://${host}`.replace(/\/+$/, "");
      }
    }
    return "https://gardenvaly.com";
  }
  /**
   * Generate standards-compliant robots.txt.
   */
  generateRobotsTxt(baseUrl) {
    return [
      "# Robots directives for Gardenvaly \u2014 by Hasna Hena",
      "User-agent: *",
      "Allow: /",
      "Allow: /shop",
      "Allow: /plants",
      "Allow: /seeds",
      "Allow: /category/",
      "Allow: /product/",
      "Allow: /dist/",
      "Allow: /assets/",
      "Allow: /src/",
      "",
      "# Private customer & administrative portal protection",
      "Disallow: /admin",
      "Disallow: /admin/",
      "Disallow: /cart",
      "Disallow: /checkout",
      "Disallow: /api/",
      "",
      `Sitemap: ${baseUrl}/sitemap.xml`,
      ""
    ].join("\n");
  }
  /**
   * Dynamically build XML sitemap indexing all published products, categories, and public landing pages.
   */
  generateSitemapXml(baseUrl) {
    try {
      const products = db.getProducts({ publishedOnly: true });
      const categories = db.getCategories();
      const entries = [
        {
          loc: `${baseUrl}/`,
          changefreq: "daily",
          priority: "1.0"
        },
        {
          loc: `${baseUrl}/shop`,
          changefreq: "daily",
          priority: "0.9"
        },
        {
          loc: `${baseUrl}/plants`,
          changefreq: "daily",
          priority: "0.9"
        },
        {
          loc: `${baseUrl}/seeds`,
          changefreq: "daily",
          priority: "0.9"
        }
      ];
      for (const cat of categories) {
        if (cat.isActive) {
          entries.push({
            loc: `${baseUrl}/category/${cat.slug}`,
            lastmod: cat.updatedAt ? new Date(cat.updatedAt).toISOString().split("T")[0] : void 0,
            changefreq: "weekly",
            priority: "0.8"
          });
        }
      }
      for (const prod of products) {
        if (prod.isPublished) {
          const modDate = prod.updatedAt || prod.createdAt;
          entries.push({
            loc: `${baseUrl}/product/${prod.slug}`,
            lastmod: modDate ? new Date(modDate).toISOString().split("T")[0] : void 0,
            changefreq: "weekly",
            priority: "0.8"
          });
        }
      }
      const xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
      ];
      for (const entry of entries) {
        xmlLines.push("  <url>");
        xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
        if (entry.lastmod) {
          xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
        }
        xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
        xmlLines.push(`    <priority>${entry.priority}</priority>`);
        const cleanBase = entry.loc;
        xmlLines.push(
          `    <xhtml:link rel="alternate" hreflang="bn" href="${escapeXml(cleanBase)}?lang=bn"/>`
        );
        xmlLines.push(
          `    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(cleanBase)}?lang=en"/>`
        );
        xmlLines.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(cleanBase)}"/>`
        );
        xmlLines.push("  </url>");
      }
      xmlLines.push("</urlset>");
      return xmlLines.join("\n");
    } catch (err) {
      console.error("[SEO] Error building XML sitemap:", err);
      return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        `  <url><loc>${escapeXml(baseUrl)}/</loc><priority>1.0</priority></url>`,
        `  <url><loc>${escapeXml(baseUrl)}/shop</loc><priority>0.9</priority></url>`,
        "</urlset>"
      ].join("\n");
    }
  }
  /**
   * Compute structured metadata for a specific route and language.
   */
  getPageSeoData(pathname, lang = "bn", baseUrl) {
    const cleanPath = pathname.split("?")[0] || "/";
    const settings = db.getSettings();
    const makeHreflang = (path3) => ({
      bn: `${baseUrl}${path3}?lang=bn`,
      en: `${baseUrl}${path3}?lang=en`,
      xDefault: `${baseUrl}${path3}`
    });
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: `${BRAND_NAME} ${BRAND_SIGNATURE}`,
      alternateName: [BRAND_NAME, settings.storeNameBn || "\u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF"],
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: lang === "bn" ? "\u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u0995\u09B0 \u0987\u09A8\u09A1\u09CB\u09B0-\u0986\u0989\u099F\u09A1\u09CB\u09B0 \u0997\u09BE\u099B \u0993 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0996\u09BE\u0981\u099F\u09BF \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AC\u09C0\u099C\u09C7\u09B0 \u09A8\u09BE\u09B0\u09CD\u09B8\u09BE\u09B0\u09BF \u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF\u0964 \u09B8\u09AC\u09C1\u099C\u09C7 \u09B8\u09BE\u099C\u09C1\u0995 \u099C\u09C0\u09AC\u09A8\u0964" : "Gardenvaly by Hasna Hena \u2014 Premium nursery for healthy indoor plants, outdoor foliage, and organic seeds.",
      telephone: settings.contactPhone,
      email: settings.contactEmail,
      priceRange: "\u09F3\u09F3",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD"
      }
    };
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${BRAND_NAME} ${BRAND_SIGNATURE}`,
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/shop?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    if (cleanPath.startsWith("/admin") || cleanPath === "/cart" || cleanPath === "/checkout") {
      const title2 = cleanPath.startsWith("/admin") ? `Gardenvaly Portal | Admin Management` : cleanPath === "/cart" ? lang === "bn" ? `\u09B6\u09AA\u09BF\u0982 \u0995\u09BE\u09B0\u09CD\u099F | ${BRAND_NAME}` : `Shopping Cart | ${BRAND_NAME}` : lang === "bn" ? `\u09A8\u09BF\u09B0\u09BE\u09AA\u09A6 \u099A\u09C7\u0995\u0986\u0989\u099F | ${BRAND_NAME}` : `Secure Checkout | ${BRAND_NAME}`;
      return {
        title: title2,
        description: "Private customer or management area. Authorized access only.",
        canonicalUrl: `${baseUrl}${cleanPath}`,
        robots: "noindex, nofollow",
        ogType: "website",
        ogTitle: title2,
        ogDescription: "Private customer or management area.",
        ogImage: DEFAULT_HERO_IMAGE,
        twitterCard: "summary",
        lang,
        hreflang: makeHreflang(cleanPath),
        jsonLd: []
      };
    }
    if (cleanPath.startsWith("/product/")) {
      const slug = cleanPath.replace("/product/", "").split("/")[0];
      const product = db.findProductBySlug(slug);
      if (!product || !product.isPublished) {
        return {
          title: lang === "bn" ? `\u09AA\u09A3\u09CD\u09AF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF | ${BRAND_NAME}` : `Product Not Found | ${BRAND_NAME}`,
          description: lang === "bn" ? "\u0985\u09A8\u09C1\u09B0\u09CB\u09A7\u0995\u09C3\u09A4 \u0997\u09BE\u099B \u09AC\u09BE \u09AC\u09C0\u099C\u099F\u09BF \u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8\u09C7 \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u099A\u09CD\u099B\u09C7 \u09A8\u09BE\u0964" : "The requested botanical item is not currently available.",
          canonicalUrl: `${baseUrl}${cleanPath}`,
          robots: "noindex, nofollow",
          ogType: "website",
          ogTitle: `Product Not Found | ${BRAND_NAME}`,
          ogDescription: "The requested plant or seed item was not found.",
          ogImage: DEFAULT_HERO_IMAGE,
          twitterCard: "summary",
          lang,
          hreflang: makeHreflang(cleanPath),
          jsonLd: [],
          statusCode: 404
        };
      }
      const name = lang === "bn" ? product.nameBn : product.nameEn;
      const desc2 = (lang === "bn" ? product.descriptionBn : product.descriptionEn) || (lang === "bn" ? product.nameBn : product.nameEn);
      const title2 = lang === "bn" ? `${product.nameBn} (${product.nameEn}) | ${BRAND_NAME} ${BRAND_SIGNATURE}` : `${product.nameEn}${product.botanicalName ? ` \u2013 ${product.botanicalName}` : ""} | ${BRAND_NAME}`;
      const canonical = `${baseUrl}/product/${product.slug}`;
      const img = product.imageUrl || product.images && product.images[0] || DEFAULT_HERO_IMAGE;
      const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        image: product.images && product.images.length > 0 ? product.images : [img],
        description: desc2,
        sku: product.SKU,
        brand: {
          "@type": "Brand",
          name: `${BRAND_NAME} ${BRAND_SIGNATURE}`
        },
        offers: {
          "@type": "Offer",
          url: canonical,
          priceCurrency: "BDT",
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          availability: product.inStock && product.stockQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: `${BRAND_NAME} ${BRAND_SIGNATURE}`
          }
        }
      };
      if (product.rating && product.reviewsCount && product.reviewsCount > 0) {
        productSchema.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewsCount
        };
      }
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "bn" ? "\u09B9\u09CB\u09AE" : "Home",
            item: `${baseUrl}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: lang === "bn" ? "\u09B6\u09AA" : "Shop",
            item: `${baseUrl}/shop`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.category,
            item: `${baseUrl}/category/${product.categorySlug}`
          },
          {
            "@type": "ListItem",
            position: 4,
            name,
            item: canonical
          }
        ]
      };
      return {
        title: title2,
        description: desc2.slice(0, 160),
        canonicalUrl: canonical,
        robots: "index, follow",
        ogType: "product",
        ogTitle: title2,
        ogDescription: desc2.slice(0, 160),
        ogImage: img,
        twitterCard: "summary_large_image",
        lang,
        hreflang: makeHreflang(`/product/${product.slug}`),
        jsonLd: [productSchema, breadcrumbSchema]
      };
    }
    if (cleanPath.startsWith("/category/")) {
      const slug = cleanPath.replace("/category/", "").split("/")[0];
      const categories = db.getCategories();
      const cat = categories.find((c) => c.slug === slug);
      if (!cat) {
        return {
          title: lang === "bn" ? `\u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF \u09AA\u09BE\u0993\u09DF\u09BE \u09AF\u09BE\u09DF\u09A8\u09BF | ${BRAND_NAME}` : `Category Not Found | ${BRAND_NAME}`,
          description: "The requested product category was not found.",
          canonicalUrl: `${baseUrl}${cleanPath}`,
          robots: "noindex, nofollow",
          ogType: "website",
          ogTitle: `Category Not Found | ${BRAND_NAME}`,
          ogDescription: "The requested product category was not found.",
          ogImage: DEFAULT_HERO_IMAGE,
          twitterCard: "summary",
          lang,
          hreflang: makeHreflang(cleanPath),
          jsonLd: [],
          statusCode: 404
        };
      }
      const name = lang === "bn" ? cat.nameBn : cat.nameEn;
      const desc2 = (lang === "bn" ? cat.descriptionBn : cat.descriptionEn) || (lang === "bn" ? `${name} \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF\u09B0 \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u0995\u09B0 \u0997\u09BE\u099B \u0993 \u0996\u09BE\u0981\u099F\u09BF \u09AC\u09C0\u099C \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8 \u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF\u09A4\u09C7\u0964` : `Explore our collection of ${name} plants and seeds at Gardenvaly.`);
      const title2 = lang === "bn" ? `${cat.nameBn} \u2014 \u09B8\u0982\u0997\u09CD\u09B0\u09B9 | ${BRAND_NAME} (by Hasna Hena)` : `${cat.nameEn} Collection | ${BRAND_NAME} by Hasna Hena`;
      const canonical = `${baseUrl}/category/${cat.slug}`;
      const img = cat.imageUrl || DEFAULT_HERO_IMAGE;
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "bn" ? "\u09B9\u09CB\u09AE" : "Home",
            item: `${baseUrl}/`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: lang === "bn" ? "\u09B6\u09AA" : "Shop",
            item: `${baseUrl}/shop`
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: canonical
          }
        ]
      };
      return {
        title: title2,
        description: desc2.slice(0, 160),
        canonicalUrl: canonical,
        robots: "index, follow",
        ogType: "website",
        ogTitle: title2,
        ogDescription: desc2.slice(0, 160),
        ogImage: img,
        twitterCard: "summary_large_image",
        lang,
        hreflang: makeHreflang(`/category/${cat.slug}`),
        jsonLd: [breadcrumbSchema]
      };
    }
    if (cleanPath === "/plants") {
      const title2 = lang === "bn" ? `\u09A4\u09BE\u099C\u09BE \u0997\u09BE\u099B\u09C7\u09B0 \u09B8\u0982\u0997\u09CD\u09B0\u09B9\u09B6\u09BE\u09B2\u09BE | ${BRAND_NAME} \u2014 by Hasna Hena` : `Live Plants Nursery Collection | ${BRAND_NAME} by Hasna Hena`;
      const desc2 = lang === "bn" ? "\u098F\u09DF\u09BE\u09B0-\u09AA\u09BF\u0989\u09B0\u09BF\u09AB\u09BE\u09DF\u09BF\u0982 \u0987\u09A8\u09A1\u09CB\u09B0 \u0997\u09BE\u099B, \u09AC\u09BE\u09B0\u09BE\u09A8\u09CD\u09A6\u09BE\u09B0 \u099A\u09BE\u09B0\u09BE \u0993 \u099B\u09BE\u09A6\u09AC\u09BE\u0997\u09BE\u09A8\u09C7\u09B0 \u09B8\u09A4\u09C7\u099C \u0997\u09BE\u099B\u09AA\u09BE\u09B2\u09BE \u09B8\u0982\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C1\u09A8 \u0996\u09BE\u0981\u099F\u09BF \u09A8\u09BE\u09B0\u09CD\u09B8\u09BE\u09B0\u09BF \u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF\u09A4\u09C7\u0964" : "Explore healthy, well-rooted air-purifying indoor plants and vibrant patio greenery by Hasna Hena.";
      return {
        title: title2,
        description: desc2,
        canonicalUrl: `${baseUrl}/plants`,
        robots: "index, follow",
        ogType: "website",
        ogTitle: title2,
        ogDescription: desc2,
        ogImage: DEFAULT_HERO_IMAGE,
        twitterCard: "summary_large_image",
        lang,
        hreflang: makeHreflang("/plants"),
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: lang === "bn" ? "\u09B9\u09CB\u09AE" : "Home", item: `${baseUrl}/` },
              { "@type": "ListItem", position: 2, name: lang === "bn" ? "\u0997\u09BE\u099B\u09AA\u09BE\u09B2\u09BE" : "Plants", item: `${baseUrl}/plants` }
            ]
          }
        ]
      };
    }
    if (cleanPath === "/seeds") {
      const title2 = lang === "bn" ? `\u0989\u09A8\u09CD\u09A8\u09A4 \u099C\u09BE\u09A4\u09C7\u09B0 \u09B6\u09BE\u0995\u09B8\u09AC\u099C\u09BF \u0993 \u09AB\u09C1\u09B2\u09C7\u09B0 \u09AC\u09C0\u099C | ${BRAND_NAME} \u2014 by Hasna Hena` : `High-Yield Vegetable & Flower Seeds | ${BRAND_NAME} by Hasna Hena`;
      const desc2 = lang === "bn" ? "\u0989\u099A\u09CD\u099A \u0985\u0999\u09CD\u0995\u09C1\u09B0\u09CB\u09A6\u0997\u09AE \u0995\u09CD\u09B7\u09AE\u09A4\u09BE\u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8 \u09A6\u09C7\u09B6\u09BF-\u09AC\u09BF\u09A6\u09C7\u09B6\u09BF \u09B6\u09BE\u0995\u09B8\u09AC\u099C\u09BF \u0993 \u09AC\u09BE\u09B9\u09BE\u09B0\u09BF \u09AB\u09C1\u09B2\u09C7\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AC\u09C0\u099C \u09B8\u0982\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C1\u09A8\u0964" : "Authentic high-germination heirloom and hybrid vegetable, herb, and flower seeds delivered nationwide.";
      return {
        title: title2,
        description: desc2,
        canonicalUrl: `${baseUrl}/seeds`,
        robots: "index, follow",
        ogType: "website",
        ogTitle: title2,
        ogDescription: desc2,
        ogImage: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&h=630&q=85",
        twitterCard: "summary_large_image",
        lang,
        hreflang: makeHreflang("/seeds"),
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: lang === "bn" ? "\u09B9\u09CB\u09AE" : "Home", item: `${baseUrl}/` },
              { "@type": "ListItem", position: 2, name: lang === "bn" ? "\u09AC\u09C0\u099C" : "Seeds", item: `${baseUrl}/seeds` }
            ]
          }
        ]
      };
    }
    if (cleanPath === "/shop") {
      const title2 = lang === "bn" ? `\u0997\u09BE\u099B \u0993 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AC\u09C0\u099C\u09C7\u09B0 \u0985\u09A8\u09B2\u09BE\u0987\u09A8 \u09B8\u0982\u0997\u09CD\u09B0\u09B9 | ${BRAND_NAME} \u2014 by Hasna Hena` : `Shop Live Plants & Organic Seeds | ${BRAND_NAME} by Hasna Hena`;
      const desc2 = lang === "bn" ? "\u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u09B2\u0997 \u2014 \u0987\u09A8\u09A1\u09CB\u09B0 \u0997\u09BE\u099B, \u09AC\u09BE\u09B0\u09BE\u09A8\u09CD\u09A6\u09BE\u09B0 \u099A\u09BE\u09B0\u09BE \u0993 \u0996\u09BE\u0981\u099F\u09BF \u09AC\u09C0\u099C \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09A4\u09C7\u0964" : "Browse Gardenvaly's curated catalog of premium nursery plants, botanical foliage, and certified organic seeds.";
      return {
        title: title2,
        description: desc2,
        canonicalUrl: `${baseUrl}/shop`,
        robots: "index, follow",
        ogType: "website",
        ogTitle: title2,
        ogDescription: desc2,
        ogImage: DEFAULT_HERO_IMAGE,
        twitterCard: "summary_large_image",
        lang,
        hreflang: makeHreflang("/shop"),
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: lang === "bn" ? "\u09B9\u09CB\u09AE" : "Home", item: `${baseUrl}/` },
              { "@type": "ListItem", position: 2, name: lang === "bn" ? "\u09B6\u09AA" : "Shop", item: `${baseUrl}/shop` }
            ]
          }
        ]
      };
    }
    const title = lang === "bn" ? `${BRAND_NAME} \u2014 \u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF | \u09B8\u09AC\u09C1\u099C\u09C7 \u09B8\u09BE\u099C\u09C1\u0995 \u099C\u09C0\u09AC\u09A8 (${BRAND_SIGNATURE})` : `${BRAND_NAME} ${BRAND_SIGNATURE} | Grow Green, Live Beautiful`;
    const desc = lang === "bn" ? "\u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u0995\u09B0 \u0987\u09A8\u09A1\u09CB\u09B0-\u0986\u0989\u099F\u09A1\u09CB\u09B0 \u0997\u09BE\u099B \u0993 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u09B0 \u0996\u09BE\u0981\u099F\u09BF \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u09AC\u09C0\u099C\u09C7\u09B0 \u09AC\u09BF\u09B6\u09CD\u09AC\u09B8\u09CD\u09A4 \u09A8\u09BE\u09B0\u09CD\u09B8\u09BE\u09B0\u09BF \u0997\u09BE\u09B0\u09CD\u09A1\u09C7\u09A8\u09AD\u09CD\u09AF\u09BE\u09B2\u09BF\u0964 \u09B8\u09AC\u09C1\u099C\u09C7 \u09B8\u09BE\u099C\u09C1\u0995 \u099C\u09C0\u09AC\u09A8\u0964" : "Premium nursery for healthy indoor plants, outdoor shrubs, and authentic high-yield organic seeds in Bangladesh. Grow green, live beautiful.";
    return {
      title,
      description: desc,
      canonicalUrl: `${baseUrl}/`,
      robots: "index, follow",
      ogType: "website",
      ogTitle: title,
      ogDescription: desc,
      ogImage: DEFAULT_HERO_IMAGE,
      twitterCard: "summary_large_image",
      lang,
      hreflang: makeHreflang("/"),
      jsonLd: [organizationSchema, websiteSchema]
    };
  }
  /**
   * Injects comprehensive SEO tags, meta directives, and JSON-LD schema into the HTML string.
   */
  injectSeoIntoHtml(html, seo) {
    let result = html;
    result = result.replace(/<html(\s+[^>]*)?>/i, `<html lang="${seo.lang}">`);
    const titleTag = `<title>${escapeHtml(seo.title)}</title>`;
    if (/<title>.*?<\/title>/is.test(result)) {
      result = result.replace(/<title>.*?<\/title>/is, titleTag);
    } else {
      result = result.replace("</head>", `  ${titleTag}
</head>`);
    }
    result = result.replace(/<meta\s+name="description"[^>]*>/gi, "").replace(/<meta\s+name="robots"[^>]*>/gi, "").replace(/<link\s+rel="canonical"[^>]*>/gi, "").replace(/<link\s+rel="alternate"\s+hreflang=[^>]*>/gi, "").replace(/<meta\s+property="og:[^"]+"[^>]*>/gi, "").replace(/<meta\s+name="twitter:[^"]+"[^>]*>/gi, "").replace(/<script\s+id="gardenvaly-schema"[^>]*>.*?<\/script>/gis, "").replace(/<meta\s+name="google-site-verification"[^>]*>/gi, "");
    const safeJsonLd = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
    const verificationTag = ENV.GOOGLE_SITE_VERIFICATION ? `  <meta name="google-site-verification" content="${escapeHtml(ENV.GOOGLE_SITE_VERIFICATION)}" />
` : "";
    const newHeadTags = [
      `  <meta name="description" content="${escapeHtml(seo.description)}" />`,
      `  <meta name="robots" content="${seo.robots}" />`,
      `  <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`,
      `  <link rel="alternate" hreflang="bn" href="${escapeHtml(seo.hreflang.bn)}" />`,
      `  <link rel="alternate" hreflang="en" href="${escapeHtml(seo.hreflang.en)}" />`,
      `  <link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.hreflang.xDefault)}" />`,
      `  <meta property="og:site_name" content="${BRAND_NAME} ${BRAND_SIGNATURE}" />`,
      `  <meta property="og:type" content="${seo.ogType}" />`,
      `  <meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
      `  <meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
      `  <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />`,
      `  <meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`,
      `  <meta property="og:locale" content="${seo.lang === "bn" ? "bn_BD" : "en_US"}" />`,
      `  <meta property="og:locale:alternate" content="${seo.lang === "bn" ? "en_US" : "bn_BD"}" />`,
      `  <meta name="twitter:card" content="${seo.twitterCard}" />`,
      `  <meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}" />`,
      `  <meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}" />`,
      `  <meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`,
      verificationTag.trim(),
      `  <script id="gardenvaly-schema" type="application/ld+json">${safeJsonLd}</script>`
    ].filter(Boolean).join("\n");
    result = result.replace("</head>", `${newHeadTags}
</head>`);
    return result;
  }
};
var seoService = new SeoService();

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
async function startServer() {
  const app = express();
  const PORT = ENV.PORT || 3e3;
  app.set("trust proxy", 1);
  app.use(securityHeadersMiddleware);
  app.use(
    cors({
      origin: true,
      // Reflects the request origin while allowing pre-configured requests
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
      credentials: true,
      maxAge: 86400
      // 24 hours preflight cache
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(inputSanitizationMiddleware);
  app.use("/api", apiRateLimiter, routes_default);
  app.get("/robots.txt", (req, res) => {
    const baseUrl = seoService.getBaseUrl(req);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(seoService.generateRobotsTxt(baseUrl));
  });
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = seoService.getBaseUrl(req);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(seoService.generateSitemapXml(baseUrl));
  });
  app.get(/^\/google([a-zA-Z0-9_-]+)\.html$/, (req, res, next) => {
    const requestedToken = req.params[0];
    const configuredToken = (ENV.GOOGLE_SITE_VERIFICATION || "").replace(/^google-site-verification=/i, "");
    if (configuredToken && requestedToken === configuredToken) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(`google-site-verification: google${configuredToken}.html`);
    }
    next();
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/@") || req.path.startsWith("/node_modules")) {
        return next();
      }
      try {
        const templatePath = path2.resolve(__dirname, "index.html");
        if (!fs2.existsSync(templatePath)) return next();
        let template = fs2.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        const baseUrl = seoService.getBaseUrl(req);
        const lang = req.query.lang === "en" ? "en" : "bn";
        const seoData = seoService.getPageSeoData(req.path, lang, baseUrl);
        const html = seoService.injectSeoIntoHtml(template, seoData);
        res.status(seoData.statusCode || 200).set({ "Content-Type": "text/html; charset=utf-8" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path2.resolve(__dirname, "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      const indexPath = path2.join(distPath, "index.html");
      if (!fs2.existsSync(indexPath)) return next();
      try {
        const template = fs2.readFileSync(indexPath, "utf-8");
        const baseUrl = seoService.getBaseUrl(req);
        const lang = req.query.lang === "en" ? "en" : "bn";
        const seoData = seoService.getPageSeoData(req.path, lang, baseUrl);
        const html = seoService.injectSeoIntoHtml(template, seoData);
        res.status(seoData.statusCode || 200).set({ "Content-Type": "text/html; charset=utf-8" }).end(html);
      } catch (err) {
        next(err);
      }
    });
  }
  app.use(errorHandler);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F33F} Gardenvaly Server active on http://0.0.0.0:${PORT}`);
    console.log(`\u{1F4E1} REST API mounted at http://0.0.0.0:${PORT}/api`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
