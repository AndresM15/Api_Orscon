import express from "express"

import itemsRouter from "./items.router.js"
import productRouter from "./product.router.js"
import categoriesRouter from "./category.router.js"
import userRouter from "./user.router.js"

export const routerApi = (app) => {
  const router = express.Router()

  app.use("/api/v1", router)

  router.use('/categories', categoriesRouter)
  router.use('/items', itemsRouter)
  router.use('/products', productRouter)
  router.use('/user', userRouter)

}

