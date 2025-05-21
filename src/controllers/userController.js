const pool = require('../config/database');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id_user = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { fullname, user, email, password, state_id, profile_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO users (fullname, user, email, password, state_id, profile_id) VALUES (?, ?, ?, ?, ?, ?)',
      [fullname, user, email, password, state_id, profile_id]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const { fullname, user, email, password, state_id, profile_id } = req.body;
    const [result] = await pool.query(
      'UPDATE users SET fullname = ?, user = ?, email = ?, password = ?, state_id = ?, profile_id = ? WHERE id_user = ?',
      [fullname, user, email, password, state_id, profile_id, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ id: req.params.id, ...req.body });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id_user = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
}; 