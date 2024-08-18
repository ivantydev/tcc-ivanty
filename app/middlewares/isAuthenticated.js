const isAuthenticated = (req, res, next) => {
  console.log('Sessão Atual:', req.session); // Verifique a sessão para ver se `isLoggedIn` está presente
  if (req.session.isLoggedIn) {
    return next();
  }
  res.status(401).json({ message: 'Acesso negado. Faça login para continuar.' });
};

module.exports = isAuthenticated;
