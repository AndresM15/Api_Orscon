export const verifyToken = (req, res) => {
  const authHeader = req.headers["authorization"];

  console.log('header back', authHeader);

  res.send('Finalizando servicio')

}
