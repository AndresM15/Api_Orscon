export const authorizeAdmin = (req, res, next) => {
  const { profile_id } = req.user;
  if (profile_id != 1) {  // O usa === 1 si en el JWT viene como número
    return res.status(403).json({ message: 'Acceso denegado: Se requieren privilegios de administrador.' });
  }
  next();
};
