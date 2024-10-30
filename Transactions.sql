-- Tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_usuario)
);

-- Tabla Productos
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('Principal', 'Complemento', 'Postre', 'Bebida') NOT NULL,
    precio DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (id_producto)
);

-- Tabla Menus
CREATE TABLE Menus (
    id_menu INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(5, 2),
    PRIMARY KEY (id_menu)
);

-- Tabla Pedidos
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT NOT NULL,
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

-- Tabla Pedido_Menu
CREATE TABLE Pedido_Menu (
    id_pedido_menu INT AUTO_INCREMENT NOT NULL,
    id_pedido INT NOT NULL,
    id_menu INT NOT NULL,
    id_producto INT NOT NULL,
    PRIMARY KEY (id_pedido_menu),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido),
    FOREIGN KEY (id_menu) REFERENCES Menus(id_menu),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Tabla Menu_Producto
CREATE TABLE Menu_Producto (
    id_menu_producto INT AUTO_INCREMENT NOT NULL,
    id_menu INT NOT NULL,
    id_producto INT NOT NULL,
    PRIMARY KEY (id_menu_producto),
    FOREIGN KEY (id_menu) REFERENCES Menus(id_menu),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);


INSERT INTO Productos(nombre, precio, tipo) VALUES 
('Pizza Margherita', 8.50, 'Principal'),
('Pizza Pepperoni', 9.50, 'Principal'),
('Pizza Hawaiana', 10.00, 'Principal'),
('Pizza BBQ', 11.00, 'Principal'),
('Pizza Vegetariana', 9.75, 'Principal'),
('Calzone', 8.90, 'Principal'),
('Pizza Mexicana', 12.00, 'Principal'),
('Pizza 4 Estaciones', 11.50, 'Principal'),
('Papas Fritas', 3.50, 'Complemento'),
('Aros de Cebolla', 3.75, 'Complemento'),
('Pan de Ajo', 2.50, 'Complemento'),
('Ensalada César', 4.50, 'Complemento'),
('Palitos de Mozzarella', 4.25, 'Complemento'),
('Dip de Queso', 2.90, 'Complemento'),
('Tiras de Pollo', 5.00, 'Complemento'),
('Alitas Picantes', 6.50, 'Complemento'),
('Coca Cola', 2.00, 'Bebida'),
('Pepsi', 2.00, 'Bebida'),
('Agua Mineral', 1.50, 'Bebida'),
('Jugo de Naranja', 2.50, 'Bebida'),
('Cerveza', 3.00, 'Bebida'),
('Vino Tinto', 4.50, 'Bebida'),
('Vino Blanco', 4.50, 'Bebida'),
('Limonada', 2.25, 'Bebida'),
('Helado de Vainilla', 3.00, 'Postre'),
('Helado de Chocolate', 3.00, 'Postre'),
('Pastel de Queso', 4.00, 'Postre'),
('Brownie con Helado', 4.50, 'Postre'),
('Tiramisú', 4.75, 'Postre'),
('Galletas de Chocolate', 2.75, 'Postre'),
('Flan de Caramelo', 3.25, 'Postre'),
('Panna Cotta', 4.25, 'Postre');

INSERT INTO Menus(nombre, precio) VALUES
('Menú Familiar', 25.00),
('Menú Pareja', 15.00),
('Menú Individual', 10.00),
('Menú Deluxe', 30.00),
('Menú Infantil', 8.00),
('Menú Vegetariano', 18.00),
('Menú Fiesta', 40.00),
('Menú Gourmet', 35.00),
('Menú Almuerzo', 12.00),
('Menú Cena Especial', 20.00);

INSERT INTO Menu_Producto(id_producto, id_menu) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 2),
(5, 3),
(6, 4),
(7, 5),
(8, 5),
(10, 6),
(12, 6),
(13, 7),
(15, 7),
(16, 8),
(18, 9),
(20, 9),
(22, 10),
(24, 10),
(26, 4),
(28, 3),
(30, 8);

