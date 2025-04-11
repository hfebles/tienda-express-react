
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  dni VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  isAdmin BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de etiquetas
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  categoryId INT,
  featuredImage VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  views INT DEFAULT 0,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla de relación producto-etiqueta
CREATE TABLE IF NOT EXISTS product_tags (
  productId INT,
  tagId INT,
  PRIMARY KEY (productId, tagId),
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);

-- Tabla de variantes de productos
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL,
  color VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla de imágenes de variantes
CREATE TABLE IF NOT EXISTS variant_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variantId INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  FOREIGN KEY (variantId) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- Tabla de métodos de pago
CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('pago_movil', 'transferencia') NOT NULL,
  bank VARCHAR(100) NOT NULL,
  accountNumber VARCHAR(30),
  phone VARCHAR(20),
  dni VARCHAR(20) NOT NULL,
  holderName VARCHAR(100),
  accountType ENUM('ahorro', 'corriente')
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  paymentMethodId INT NOT NULL,
  shippingAddress VARCHAR(255) NOT NULL,
  shippingCity VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id) ON DELETE RESTRICT
);

-- Tabla de items de pedido
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  variantId INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (variantId) REFERENCES product_variants(id) ON DELETE RESTRICT
);

-- Tabla de referencias de pago
CREATE TABLE IF NOT EXISTS payment_references (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL,
  paymentMethodId INT NOT NULL,
  referenceNumber VARCHAR(100) NOT NULL,
  bankOrigin VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  imageUrl VARCHAR(255),
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id) ON DELETE RESTRICT
);

-- Insertar datos de ejemplo para categorías
INSERT INTO categories (name, description, slug) VALUES 
('Electrónicos', 'Productos electrónicos y gadgets', 'electronicos'),
('Ropa', 'Ropa y accesorios de moda', 'ropa'),
('Hogar', 'Productos para el hogar', 'hogar');

-- Insertar datos de ejemplo para etiquetas
INSERT INTO tags (name, slug) VALUES 
('Oferta', 'oferta'),
('Nuevo', 'nuevo'),
('Popular', 'popular');
