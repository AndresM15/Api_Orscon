import { pool } from "../libs/db.js";
import { errorHandler } from "../helpers/errorHandler.js";
import { sendOrderConfirmationEmail } from '../helpers/emailHelper.js';

export const createOrder = async (req, res) => {
    // const { shipping_info, items, email } = req.body;
    const { shipping_info, items } = req.body;
  
    const user_id = req.user.id_user;
  
    try {
      await pool.query('START TRANSACTION');
  
      // Extrae los datos de la dirección
      const { address_line, city, state, country, postal_code } = shipping_info;
  
      // Busca si ya existe esa dirección para el usuario
      const [existingAddress] = await pool.query(
        `SELECT id_address FROM addresses WHERE 
          user_id = ? AND 
          address_line = ? AND 
          city = ? AND 
          state = ? AND 
          country = ? AND 
          postal_code = ?`,
        [user_id, address_line, city, state, country, postal_code]
      );
  
      let id_address;
      if (existingAddress.length > 0) {
        id_address = existingAddress[0].id_address;
      } else {
        // Si no existe, la crea
        const [addressResult] = await pool.query(
          `INSERT INTO addresses (user_id, address_line, city, state, country, postal_code)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [user_id, address_line, city, state, country, postal_code]
        );
        id_address = addressResult.insertId;
      }
  
      let total = 0;
      // 1. Verificar stock y calcular total
      for (const item of items) {
        const [product] = await pool.query(
          'SELECT id_product, name, stock, price FROM products WHERE id_product = ?',
          [item.product_id]
        );
        if (!product.length) {
          await pool.query('ROLLBACK');
          return res.status(404).json({ message: 'Producto no encontrado', product_id: item.product_id });
        }
        if (product[0].stock < item.quantity) {
          await pool.query('ROLLBACK');
          return res.status(400).json({ 
            message: 'Stock insuficiente',
            available_stock: product[0].stock,
            requested_quantity: item.quantity,
            product_name: product[0].name
          });
        }
        total += product[0].price * item.quantity;
      }
  
      // 2. Crear la orden
      const [orderResult] = await pool.query(
        `INSERT INTO orders (user_id, total_amount, status, shipping_address_id) 
         VALUES (?, ?, 'pending', ?)`,
        [user_id, total, id_address]
      );
      const orderId = orderResult.insertId;
  
      // 3. Crear items de la orden y actualizar stock
      for (const item of items) {
        const [product] = await pool.query(
          'SELECT price FROM products WHERE id_product = ?',
          [item.product_id]
        );
        await pool.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, product[0].price]
        );
        await pool.query(
          'UPDATE products SET stock = stock - ? WHERE id_product = ?',
          [item.quantity, item.product_id]
        );
      }
  
      // Obtén el email del usuario autenticado
      const [userResult] = await pool.query(
        'SELECT email FROM users WHERE id_user = ?',
        [user_id]
      );
  
      if (!userResult.length) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const email = userResult[0].email;
  
      // 4. Enviar correo de confirmación (puedes personalizar el contenido)
      await sendOrderConfirmationEmail({
        email,
        orderId,
        total
      });
  
      await pool.query('COMMIT');
      res.status(201).json({
        message: 'Orden creada exitosamente',
        orderId,
        total
      });
  
    } catch (error) {
      await pool.query('ROLLBACK');
      errorHandler(res, 500, "Error al procesar la orden", error);
    }
  };