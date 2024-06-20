const express = require("express");
const router = express.Router();

// Importar rotas gerais
const indexRoutes = require('./routes/indexRoutes');

// Importar rotas de clientes
const clientesRoutes = require('./routes/clientesRoutes');

// Usar as rotas gerais
router.use('/', indexRoutes);

// Usar as rotas de clientes com prefixo '/api'
router.use('/api', clientesRoutes);

module.exports = router;
