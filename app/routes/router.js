const express = require("express");
const router = express.Router();

// Importar rotas gerais
const indexRoutes = require('./routes/indexRoutes');

// Importar rotas de clientes
const clientesRoutes = require('./routes/clientesRoutes');

// Importar rotas de obras
const obrasRoutes = require('./routes/obrasRoutes');

// Importar rotas de pedidos
const pedidosRoutes = require('./routes/pedidosRoutes');

// Importar rotas de carrinho
const carrinhoRoutes = require('./routes/carrinhoRoutes');

const paymentRoutes = require('./routes/paymentRoutes')

// Usar as rotas gerais
router.use('/', indexRoutes);

// Usar as rotas de clientes com prefixo '/api'
router.use('/api', clientesRoutes);

// Usar as rotas de obras com prefixo '/api'
router.use('/api', obrasRoutes);

// Usar as rotas de pedidos com prefixo '/api'
router.use('/api', pedidosRoutes);

// Usar as rotas de carrinho com prefixo '/api'
router.use('/api', carrinhoRoutes);

// Usar as rotas de carrinho com prefixo '/api'
router.use('/api/payment', paymentRoutes);

module.exports = router;
