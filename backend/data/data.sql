-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS product_sizes CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_details CASCADE; 
DROP TABLE IF EXISTS products CASCADE;

-- Create tables
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(255) NOT NULL,
  subcategory VARCHAR(255),
  type VARCHAR(255),
  image VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_details (
  id SERIAL PRIMARY KEY,
  "productId" VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
  detail TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  "productId" VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
  "imageUrl" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_sizes (
  id SERIAL PRIMARY KEY,
  "productId" VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert product data
INSERT INTO products (id, name, brand, price, category, subcategory, type, image) VALUES 
('lightweight-linen-shirt', 'Lightweight Linen Shirt', 'Polo Ralph Lauren', 500000, 'Men', 'Shirt', 'Formal shirt', '/images/products/lightweight-linen-shirt.jpg'),
('slim-fit-chino', 'Slim Fit Chino', 'Polo Ralph Lauren', 450000, 'Men', 'Pants', 'Casual pants', '/images/products/slim-fit-chino.jpg');

-- Insert product details
INSERT INTO product_details ("productId", detail) VALUES
('lightweight-linen-shirt', 'Classic fit: cut fuller through the chest, waist, and sleeve, with a lower armhole.'),
('lightweight-linen-shirt', 'Button-down collar with front pocket.'),
('lightweight-linen-shirt', 'Made from 100% linen fabric.'),
('slim-fit-chino', 'Slim fit through the waist and thigh.'),
('slim-fit-chino', 'Stretch cotton twill for comfort.'),
('slim-fit-chino', 'Belt loops and button closure.');

-- Insert product gallery images
INSERT INTO product_images ("productId", "imageUrl") VALUES
('lightweight-linen-shirt', '/images/products/lightweight-linen-shirt.jpg'),
('lightweight-linen-shirt', '/images/products/lightweight-linen-shirt-2.jpg'),
('slim-fit-chino', '/images/products/slim-fit-chino.jpg'),
('slim-fit-chino', '/images/products/slim-fit-chino-2.jpg');

-- Insert product sizes
INSERT INTO product_sizes ("productId", size) VALUES
('lightweight-linen-shirt', 'S'),
('lightweight-linen-shirt', 'M'),
('lightweight-linen-shirt', 'L'),
('lightweight-linen-shirt', 'XL'),
('slim-fit-chino', '30'),
('slim-fit-chino', '32'),
('slim-fit-chino', '34'),
('slim-fit-chino', '36');