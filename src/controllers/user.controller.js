import { pool } from "../libs/db.js";
import { errorHandler } from "../helpers/errorHandler.js";
import jwt from 'jsonwebtoken';

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
  const { body } = req
  const { fullname, email, user, password, profile_id = "user" } = body
  pool.query(`
    insert into users (fullname, user, email, password, state_id, profile_id)
    rvalues ("${fullname}", "${user}", "${email}", "${password}", "user", ${profile_id})

  `)
  .then((data) => {
    const info = data[0]
    res.json({
      data: info
    })
  })
  .catch(error => {
    errorHandler(res, 404, "Error al crear el usuario", error)
  })
}

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
