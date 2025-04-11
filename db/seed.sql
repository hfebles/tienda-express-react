
USE ecommerce_db;

-- Insertar usuarios de ejemplo
INSERT INTO users (email, dni, phone, name, address, city, isAdmin) VALUES 
('admin@example.com', '12345678', '+58123456789', 'Administrador', 'Calle Principal 123', 'Caracas', TRUE),
('cliente@example.com', '87654321', '+58987654321', 'Cliente Demo', 'Avenida Libertador 456', 'Valencia', FALSE);

-- Insertar productos de ejemplo
INSERT INTO products (name, description, slug, categoryId, views) VALUES 
('Smartphone XYZ', 'Un smartphone de última generación con características increíbles.', 'smartphone-xyz', 1, 150),
('Laptop Pro', 'Laptop potente para profesionales y diseñadores.', 'laptop-pro', 1, 120),
('Camisa Casual', 'Camisa casual para uso diario, 100% algodón.', 'camisa-casual', 2, 80),
('Sofá Moderno', 'Sofá moderno para sala de estar, muy cómodo.', 'sofa-moderno', 3, 45),
('Lámpara LED', 'Lámpara LED con ajuste de intensidad para escritorio.', 'lampara-led', 3, 30);

-- Insertar variantes de productos
INSERT INTO product_variants (productId, color, price, stock) VALUES 
(1, 'Negro', 599.99, 15),
(1, 'Blanco', 599.99, 10),
(1, 'Azul', 649.99, 5),
(2, 'Gris', 1299.99, 8),
(2, 'Plateado', 1299.99, 12),
(3, 'Blanco', 39.99, 25),
(3, 'Azul', 39.99, 20),
(3, 'Negro', 39.99, 18),
(4, 'Gris', 399.99, 5),
(4, 'Beige', 399.99, 3),
(5, 'Negro', 49.99, 30),
(5, 'Blanco', 49.99, 25);

-- Insertar imágenes para variantes
INSERT INTO variant_images (variantId, url) VALUES 
(1, '/products/smartphone-black-1.jpg'),
(1, '/products/smartphone-black-2.jpg'),
(2, '/products/smartphone-white-1.jpg'),
(3, '/products/smartphone-blue-1.jpg'),
(4, '/products/laptop-gray-1.jpg'),
(5, '/products/laptop-silver-1.jpg'),
(6, '/products/shirt-white-1.jpg'),
(7, '/products/shirt-blue-1.jpg'),
(8, '/products/shirt-black-1.jpg'),
(9, '/products/sofa-gray-1.jpg'),
(10, '/products/sofa-beige-1.jpg'),
(11, '/products/lamp-black-1.jpg'),
(12, '/products/lamp-white-1.jpg');

-- Insertar relaciones producto-etiqueta
INSERT INTO product_tags (productId, tagId) VALUES 
(1, 2), -- Smartphone - Nuevo
(1, 3), -- Smartphone - Popular
(2, 1), -- Laptop - Oferta
(3, 3), -- Camisa - Popular
(4, 1), -- Sofá - Oferta
(5, 2); -- Lámpara - Nuevo

-- Insertar métodos de pago
INSERT INTO payment_methods (type, bank, accountNumber, phone, dni, holderName, accountType) VALUES 
('transferencia', 'Banco Nacional', '1234567890', NULL, '12345678', 'Tienda Online', 'corriente'),
('pago_movil', 'Banco Nacional', NULL, '+58123456789', '87654321', NULL, NULL);
