create schema api_general;
use api_general;
SET time_zone = '-05:00';

-- Tabla de estados generales (activo, inactivo, eliminado)
CREATE TABLE states (
  id_state INT PRIMARY KEY,
  description VARCHAR(50) NOT NULL
);

-- Tabla de perfiles de usuario (cliente, administrador, etc.)
CREATE TABLE profiles (
  id_profile VARCHAR(30) PRIMARY KEY,
  description VARCHAR(100) NOT NULL
);

-- Usuarios del sistema
CREATE TABLE users (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  fullname VARCHAR(200) NOT NULL,
  user VARCHAR(200) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  state_id INT,
  profile_id VARCHAR(30) NOT NULL,
  FOREIGN KEY (state_id) REFERENCES states(id_state),
  FOREIGN KEY (profile_id) REFERENCES profiles(id_profile)
);

-- Productos disponibles en la tienda
CREATE TABLE products (
  id_product INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  state_id INT,
  FOREIGN KEY (state_id) REFERENCES states(id_state)
);

-- Ítems del carrito (productos agregados pero no comprados aún)
CREATE TABLE cart_items (
  id_cart_item INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  product_id INT,
  quantity INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id_user),
  FOREIGN KEY (product_id) REFERENCES products(id_product)
);

-- Direcciones de envío asociadas a un usuario
CREATE TABLE addresses (
  id_address INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  address_line VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id_user)
);

-- Pedidos realizados por los usuarios
CREATE TABLE orders (
  id_order INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2),
  status VARCHAR(50),
  shipping_address_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id_user),
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id_address)
);

-- Productos incluidos en un pedido
CREATE TABLE order_items (
  id_order_item INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id_order),
  FOREIGN KEY (product_id) REFERENCES products(id_product)
);

-- Reseñas y calificaciones de productos
CREATE TABLE reviews (
  id_review INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  product_id INT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  approved BOOLEAN DEFAULT FALSE,
  review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id_user),
  FOREIGN KEY (product_id) REFERENCES products(id_product)
);

-- Lista de deseos de cada usuario
CREATE TABLE wishlist (
  id_wishlist INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  product_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id_user),
  FOREIGN KEY (product_id) REFERENCES products(id_product)
);

-- Cupones de descuento generados por administradores
CREATE TABLE coupons (
  id_coupon INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INT CHECK (discount_percentage BETWEEN 0 AND 100),
  valid_until DATE
);

-- Cupones aplicados por los usuarios en sus compras
CREATE TABLE applied_coupons (
  id_applied_coupon INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  coupon_id INT,
  FOREIGN KEY (order_id) REFERENCES orders(id_order),
  FOREIGN KEY (coupon_id) REFERENCES coupons(id_coupon)
);
