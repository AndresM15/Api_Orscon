import { pool } from "../libs/db.js";

import { errorHandler } from "../helpers/errorHandler.js";

export const getAll = (req, res) => {
  pool.query('select * from products')
  .then((data) => {
    const info = data[0]
    res.json({
      status: 200,
      message: 'Informacion obtenida con exito',
      data: info
    })
  })
  .catch(error => {
    errorHandler(res, 404, "Error al obtener la informacion de los productos", error)
  })
}

export const getProductById = (req, res) => {
  const { idProduct } = req.params
  pool.query(`select * from products where id_product = ${idProduct}`)
  .then((data) => {
    const info = data[0]
    res.json({
      status: 0,
      message: '',
      data: info[0]
    })
  })
  .catch(error => {
    errorHandler(res, 404, "Error al obtener la informacion de los productos", error)
  })
}
