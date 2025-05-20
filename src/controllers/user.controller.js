import { pool } from "../libs/db.js";
import { errorHandler } from "../helpers/errorHandler.js";
import jwt from 'jsonwebtoken';
import { sendRecoveryEmail } from '../helpers/emailHelper.js';


export const getUserById = (req, res) => {
  const { id_user } = req.params
  pool.query(`
    select *
    from users
    where id_user = ${id_user}
  `)
  .then((data) => {
    const info = data[0]
    res.json({
      data: info
    })
  })
  .catch(error => {
    errorHandler(res, 404, "Error al obtener la informacion de los productos", error)
  })
}

export const createUser = (req, res) => {
  const { fullname, email, user, password, profile_id = 2 } = req.body;
  const state_id = 1;

  const query = `
    INSERT INTO users (fullname, user, email, password, state_id, profile_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [fullname, user, email, password, state_id, profile_id];

  pool.query(query, values)
    .then((data) => {
      res.json({
        message: "Usuario creado exitosamente",
        data: data[0]
      });
    })
    .catch(error => {
      errorHandler(res, 404, "Error al crear el usuario", error);
    });
};
export const updateUser = ({ body }, res) => {
  const { user } = body
  const { id_user, fullname, email, userName, password } = user
  pool.query(`
    update users
    set
      fullname = '${fullname}',
      email = '${email}',
      user = '${userName}',
      password = '${password}'
    where id_user = ${id_user}
  `)
  .then((data) => {
    const info = data[0]
    res.json({
      data: info
    })
  })
  .catch(error => {
    errorHandler(res, 404, "Error al actualizar el usuario", error)
  })

}

export const verifyUser = (req, res) => {
  const { email, password } = req.body;

  pool.query(`
    SELECT * FROM users WHERE email = "${email}" AND password = "${password}"
  `)
  .then(([users]) => {
    if (!users.length) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = users[0];

    const token = jwt.sign(
      { id_user: user.id_user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id_user: user.id_user,
        fullname: user.fullname,
        email: user.email
      }
    });
  })
  .catch((error) => {
    console.error("Error al verificar el usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  });
};



export const getUserProfile = (req, res) => {
  const { id_user } = req.user;

  pool.query(`SELECT id_user, fullname, email, user FROM users WHERE id_user = ?`, [id_user])
    .then(([rows]) => {
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Error al obtener el perfil", error });
    });
};

export const recoverPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'El correo es obligatorio.' });

  try {
    // Buscar al usuario por email
    const [result] = await pool.query(`SELECT id_user FROM users WHERE email = ?`, [email]);

    if (!result.length) {
      return res.status(404).json({ message: 'Correo no registrado.' });
    }

    const userId = result[0].id_user;

    // Generar token de recuperación válido por 15 minutos
    const token = jwt.sign({ id_user: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    // Link para restablecer la contraseña (esto depende de tu frontend)
    const resetLink = `http://127.0.0.1:5501/login/reset-password.html?token=${token}`;

    // Enviar correo
    await sendRecoveryEmail(email, resetLink);

    return res.status(200).json({ message: 'Correo de recuperación enviado.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al enviar correo de recuperación.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.id_user;

    const query = `UPDATE users SET password = ? WHERE id_user = ?`;
    await pool.query(query, [newPassword, userId]);

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El enlace ha expirado. Solicita uno nuevo.' });
    }

    return res.status(401).json({ message: 'Token inválido o caducado.' });
  }
};
