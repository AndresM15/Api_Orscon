import { pool } from "../libs/db.js";

import { errorHandler } from "../helpers/errorHandler.js";

export const getAll = (req, res) => {
  pool.query('select * from products')
  .then((data) => {
    const info = data[0]
    res.json({
      status: 0,
      message: '',
      data: info
    })
  })
  .catch(error => {
    errorHandler(res, 404, "Error al obtener la informacion de los productos", error)
  })
}
