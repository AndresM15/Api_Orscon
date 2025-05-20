create schema api_general;
use api_general;
SET time_zone = '-05:00';

create table states (
  id_state int primary key,
  description varchar(50) NOT NULL
);
--users
create table users (
  id_user int primary key auto_increment,
  fullname varchar(200) NOT NULL,
  user varchar(200) NOT NULL,
  email varchar(100) UNIQUE NOT NULL,
  password varchar(255) NOT NULL,
  state_id int,
  foreign key (state_id) references states(id_state)
);

CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

--Usuario
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    correo_electronico VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_usuario ENUM('cliente', 'administrador') DEFAULT 'cliente'
);

--Categoria
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50),
    descripcion TEXT
);

--Producto
CREATE TABLE Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    stock INT,
    categoria INT,
    imagen_url VARCHAR(255),
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria) REFERENCES Categoria(id_categoria)
);

-- Carrito
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Carrito_Producto
CREATE TABLE Carrito_Producto (
    id_carrito_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT,
    id_producto INT,
    cantidad INT,
    FOREIGN KEY (id_carrito) REFERENCES Carrito(id_carrito),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- Pedido
CREATE TABLE Pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2),
    estado ENUM('pendiente', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    metodo_pago VARCHAR(50),
    direccion_entrega TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Detalle_Pedido
CREATE TABLE Detalle_Pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10, 2),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

--Pago 
CREATE TABLE Pago (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10, 2),
    metodo_pago VARCHAR(50),
    estado_pago ENUM('pendiente', 'completado', 'fallido') DEFAULT 'pendiente',
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
);