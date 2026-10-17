-- =========================================================================
-- Gardenvaly by Hasna Hena — PostgreSQL Relational Database Schema
-- Brand: Gardenvaly | Sub-brand: by Hasna Hena
-- Tags: Bangladeshi Plant & Seed Nursery E-commerce
-- =========================================================================

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'store_manager', -- superadmin, store_manager, inventory_staff
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- plant, seed, tool, care
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- plant, seed, tool, care
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    category_slug VARCHAR(255) NOT NULL,
    
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    botanical_name VARCHAR(255),
    description_en TEXT,
    description_bn TEXT,
    
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount_percent INT DEFAULT 0,
    
    stock_quantity INT NOT NULL DEFAULT 0,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    
    rating DECIMAL(2, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    
    -- Specific botanical & gardening attributes
    indoor_outdoor VARCHAR(50) DEFAULT 'both', -- indoor, outdoor, both
    packet_size_en VARCHAR(100),
    packet_size_bn VARCHAR(100),
    plant_height_en VARCHAR(100),
    plant_height_bn VARCHAR(100),
    plant_age_en VARCHAR(100),
    plant_age_bn VARCHAR(100),
    sunlight_en VARCHAR(255),
    sunlight_bn VARCHAR(255),
    water_en VARCHAR(255),
    water_bn VARCHAR(255),
    soil_type_en VARCHAR(255),
    soil_type_bn VARCHAR(255),
    planting_season_en VARCHAR(255),
    planting_season_bn VARCHAR(255),
    
    tags_en JSONB DEFAULT '[]'::jsonb,
    tags_bn JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    division VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100),
    address_detail TEXT NOT NULL,
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    first_order_date TIMESTAMP WITH TIME ZONE,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. GV-2026-0841
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Snapshot of customer info at ordering
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    customer_division VARCHAR(100) NOT NULL,
    customer_district VARCHAR(100) NOT NULL,
    customer_upazila VARCHAR(100),
    customer_address TEXT NOT NULL,
    delivery_instructions TEXT,
    
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 60.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    delivery_method VARCHAR(50) NOT NULL DEFAULT 'home-delivery',
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash-on-delivery',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid', -- unpaid, paid, refunded
    order_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    
    admin_notes TEXT,
    status_history JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    image_url TEXT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    line_subtotal DECIMAL(10, 2) NOT NULL
);

-- 7. INVENTORY ADJUSTMENTS AUDIT
CREATE TABLE IF NOT EXISTS inventory_adjustments (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    quantity_changed INT NOT NULL,
    new_quantity INT NOT NULL,
    reason VARCHAR(255) NOT NULL, -- restock, damaged, correction, customer_order
    admin_user_id VARCHAR(64),
    admin_user_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'default',
    store_name_en VARCHAR(255) NOT NULL DEFAULT 'Gardenvaly',
    store_name_bn VARCHAR(255) NOT NULL DEFAULT 'গার্ডেনভ্যালি',
    signature_en VARCHAR(255) NOT NULL DEFAULT 'by Hasna Hena',
    signature_bn VARCHAR(255) NOT NULL DEFAULT 'হাসনা হেনা কর্তৃক পরিচালিত',
    tagline_en VARCHAR(255) DEFAULT 'Grow Green, Live Beautiful',
    tagline_bn VARCHAR(255) DEFAULT 'সবুজে সাজুক জীবন',
    contact_phone VARCHAR(50) DEFAULT '+880 1712-345678',
    contact_email VARCHAR(255) DEFAULT 'contact@gardenvaly.com',
    official_whatsapp VARCHAR(50) DEFAULT '+880 1712-345678',
    standard_delivery_fee DECIMAL(10, 2) DEFAULT 60.00,
    free_delivery_threshold DECIMAL(10, 2) DEFAULT 2000.00,
    enable_pickup BOOLEAN DEFAULT TRUE,
    order_notification_email VARCHAR(255) DEFAULT 'admin@gardenvaly.com',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    demo_mode_notice BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
