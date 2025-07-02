-- Textura Database Schema and Initial Data
-- This file creates the complete database structure and populates it with sample data

-- Drop existing tables if they exist (in correct order to avoid foreign key constraints)
DROP TABLE IF EXISTS "productSizes" CASCADE;
DROP TABLE IF EXISTS "productImages" CASCADE;
DROP TABLE IF EXISTS "productDetails" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "admins" CASCADE;

-- Create products table
CREATE TABLE IF NOT EXISTS "products" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "category" VARCHAR(100),
    "brand" VARCHAR(100),
    "sku" VARCHAR(100) UNIQUE,
    "stock" INTEGER DEFAULT 0,
    "featured" BOOLEAN DEFAULT false,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create productDetails table
CREATE TABLE IF NOT EXISTS "productDetails" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER REFERENCES "products"("id") ON DELETE CASCADE,
    "material" VARCHAR(255),
    "care_instructions" TEXT,
    "origin" VARCHAR(100),
    "weight" DECIMAL(5,2),
    "dimensions" VARCHAR(255),
    "color" VARCHAR(100),
    "style" VARCHAR(100),
    "season" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create productImages table
CREATE TABLE IF NOT EXISTS "productImages" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER REFERENCES "products"("id") ON DELETE CASCADE,
    "imageUrl" VARCHAR(500) NOT NULL,
    "altText" VARCHAR(255),
    "isPrimary" BOOLEAN DEFAULT false,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create productSizes table
CREATE TABLE IF NOT EXISTS "productSizes" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER REFERENCES "products"("id") ON DELETE CASCADE,
    "size" VARCHAR(10) NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "price_adjustment" DECIMAL(10,2) DEFAULT 0.00,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS "admins" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(100) UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "role" VARCHAR(50) DEFAULT 'admin',
    "active" BOOLEAN DEFAULT true,
    "lastLogin" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO "products" ("name", "description", "price", "category", "brand", "sku", "stock", "featured", "active") VALUES
('Nike Dunk Low Retro', 'Classic basketball shoe with premium leather upper', 110.00, 'footwear', 'Nike', 'NDL-001', 50, true, true),
('Nike Dunk Retro Panda', 'Iconic black and white colorway of the classic Dunk', 120.00, 'footwear', 'Nike', 'NDP-001', 35, true, true),
('Adidas Samba OG', 'Timeless soccer-inspired sneaker with suede details', 100.00, 'footwear', 'Adidas', 'ASO-001', 40, true, true),
('Nike Killshot 2', 'Retro tennis shoe with clean minimalist design', 90.00, 'footwear', 'Nike', 'NK2-001', 60, false, true),
('Nike T-Shirt SS25', 'Premium cotton t-shirt with modern fit', 35.00, 'clothing', 'Nike', 'NTS-001', 100, false, true),
('Nike Button-Up Shirt', 'Professional button-up with moisture-wicking fabric', 75.00, 'clothing', 'Nike', 'NBS-001', 45, false, true),
('Lightweight Linen Shirt', 'Breathable linen shirt perfect for summer', 65.00, 'clothing', 'Unbranded', 'LLS-001', 30, false, true),
('Slim Fit Chino', 'Modern chino pants with stretch fabric', 85.00, 'clothing', 'Unbranded', 'SFC-001', 55, false, true);

-- Insert product details
INSERT INTO "productDetails" ("productId", "material", "care_instructions", "origin", "color", "style", "season") VALUES
(1, 'Leather/Rubber', 'Wipe clean with damp cloth', 'Vietnam', 'White/Black', 'Basketball', 'All Season'),
(2, 'Leather/Rubber', 'Wipe clean with damp cloth', 'Vietnam', 'Black/White', 'Basketball', 'All Season'),
(3, 'Suede/Rubber', 'Brush gently, avoid water', 'Vietnam', 'Navy/White', 'Soccer', 'All Season'),
(4, 'Leather/Rubber', 'Wipe clean with damp cloth', 'Vietnam', 'White/Navy', 'Tennis', 'All Season'),
(5, '100% Cotton', 'Machine wash cold, tumble dry low', 'Honduras', 'Navy', 'Casual', 'All Season'),
(6, 'Cotton Blend', 'Machine wash cold, hang dry', 'Vietnam', 'White', 'Business Casual', 'All Season'),
(7, '100% Linen', 'Machine wash cold, air dry', 'India', 'Light Blue', 'Casual', 'Summer'),
(8, 'Cotton/Spandex', 'Machine wash cold, tumble dry low', 'Bangladesh', 'Khaki', 'Casual', 'All Season');

-- Insert product images
INSERT INTO "productImages" ("productId", "imageUrl", "altText", "isPrimary", "sortOrder") VALUES
(1, '/images/products/nike-dunk-low.jpg', 'Nike Dunk Low Retro - Main View', true, 1),
(1, '/images/products/nike-dunk-low-2.jpg', 'Nike Dunk Low Retro - Side View', false, 2),
(2, '/images/products/nike_dunk_retro_panda_1.jpg', 'Nike Dunk Retro Panda - Main View', true, 1),
(2, '/images/products/nike_dunk_retro_panda_2.jpg', 'Nike Dunk Retro Panda - Side View', false, 2),
(2, '/images/products/nike_dunk_retro_panda_3.jpg', 'Nike Dunk Retro Panda - Detail View', false, 3),
(3, '/images/products/adidas-samba-og.jpg', 'Adidas Samba OG - Main View', true, 1),
(3, '/images/products/adidas-samba-og-2.jpg', 'Adidas Samba OG - Side View', false, 2),
(4, '/images/products/nike-killshot-2.jpg', 'Nike Killshot 2 - Main View', true, 1),
(4, '/images/products/nike-killshot-2-2.jpg', 'Nike Killshot 2 - Side View', false, 2),
(5, '/images/products/nike-tshirt-ss25.jpg', 'Nike T-Shirt SS25 - Main View', true, 1),
(5, '/images/products/nike-tshirt-ss25-2.jpg', 'Nike T-Shirt SS25 - Detail View', false, 2),
(6, '/images/products/nike-button-up.jpg', 'Nike Button-Up Shirt - Main View', true, 1),
(6, '/images/products/nike-button-up-2.jpg', 'Nike Button-Up Shirt - Detail View', false, 2),
(7, '/images/products/lightweight-linen-shirt.jpg', 'Lightweight Linen Shirt - Main View', true, 1),
(7, '/images/products/lightweight-linen-shirt-2.JPG', 'Lightweight Linen Shirt - Detail View', false, 2),
(8, '/images/products/slim-fit-chino.jpg', 'Slim Fit Chino - Main View', true, 1);

-- Insert product sizes for footwear
INSERT INTO "productSizes" ("productId", "size", "stock") VALUES
-- Nike Dunk Low Retro
(1, '7', 8), (1, '7.5', 10), (1, '8', 12), (1, '8.5', 15), (1, '9', 18), (1, '9.5', 20), (1, '10', 15), (1, '10.5', 12), (1, '11', 10), (1, '11.5', 8), (1, '12', 5),
-- Nike Dunk Retro Panda
(2, '7', 5), (2, '7.5', 8), (2, '8', 10), (2, '8.5', 12), (2, '9', 15), (2, '9.5', 18), (2, '10', 12), (2, '10.5', 10), (2, '11', 8), (2, '11.5', 5), (2, '12', 3),
-- Adidas Samba OG
(3, '7', 6), (3, '7.5', 9), (3, '8', 11), (3, '8.5', 14), (3, '9', 16), (3, '9.5', 18), (3, '10', 14), (3, '10.5', 11), (3, '11', 9), (3, '11.5', 6), (3, '12', 4),
-- Nike Killshot 2
(4, '7', 10), (4, '7.5', 12), (4, '8', 15), (4, '8.5', 18), (4, '9', 20), (4, '9.5', 22), (4, '10', 18), (4, '10.5', 15), (4, '11', 12), (4, '11.5', 10), (4, '12', 8);

-- Insert product sizes for clothing
INSERT INTO "productSizes" ("productId", "size", "stock") VALUES
-- Nike T-Shirt SS25
(5, 'XS', 15), (5, 'S', 25), (5, 'M', 30), (5, 'L', 25), (5, 'XL', 20), (5, 'XXL', 10),
-- Nike Button-Up Shirt
(6, 'XS', 8), (6, 'S', 12), (6, 'M', 15), (6, 'L', 12), (6, 'XL', 10), (6, 'XXL', 5),
-- Lightweight Linen Shirt
(7, 'XS', 5), (7, 'S', 8), (7, 'M', 10), (7, 'L', 8), (7, 'XL', 6), (7, 'XXL', 3),
-- Slim Fit Chino
(8, '28', 8), (8, '30', 12), (8, '32', 15), (8, '34', 12), (8, '36', 10), (8, '38', 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products"("category");
CREATE INDEX IF NOT EXISTS "idx_products_brand" ON "products"("brand");
CREATE INDEX IF NOT EXISTS "idx_products_featured" ON "products"("featured");
CREATE INDEX IF NOT EXISTS "idx_products_active" ON "products"("active");
CREATE INDEX IF NOT EXISTS "idx_productImages_productId" ON "productImages"("productId");
CREATE INDEX IF NOT EXISTS "idx_productDetails_productId" ON "productDetails"("productId");
CREATE INDEX IF NOT EXISTS "idx_productSizes_productId" ON "productSizes"("productId");
CREATE INDEX IF NOT EXISTS "idx_admins_username" ON "admins"("username");
CREATE INDEX IF NOT EXISTS "idx_admins_email" ON "admins"("email");

-- Insert a default admin user (password: admin123)
-- Note: In production, this should be changed and passwords should be properly hashed
INSERT INTO "admins" ("username", "email", "password", "firstName", "lastName", "role") 
VALUES ('admin', 'admin@textura.com', '$2b$10$rQOQ1HnF0l.LIhV.rj3jSOzQ8rDN3jK5uQw5lJ3wJ3wJ3wJ3wJ3wJ', 'Admin', 'User', 'admin')
ON CONFLICT (username) DO NOTHING;
