import { pool } from "../libs/db.js";

import { errorHandler } from "../helpers/errorHandler.js";

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
  const { name, email, user, password } = body

  pool.query(`
    insert into users (fullname, user, email, password, state_id)
    values
    ("${name}", "${user}", "${email}", "${password}", 1)
  `)
  .then((data) => {
    const info = data[0]
    res.json({
      data: info
    })
  })
  .catch(error => {
    console.log('Error al crear', error);

    errorHandler(res, 404, "Error al crear el usuario", error)
  })
}

