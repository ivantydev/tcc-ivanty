const isAuthenticated = (req, res, next) => {
  console.log('Sessão:', req.session);
  if (req.session.isLoggedIn) {
    return next();
  }
  res.status(401).json({ message: 'Acesso negado. Faça login para continuar.' });
};

module.exports = isAuthenticated;
