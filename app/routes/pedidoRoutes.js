const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/pedidos', pedidoController.createPedido);
router.get('/pedidos/:id_cliente', pedidoController.getPedidosByClienteId);

module.exports = router;
