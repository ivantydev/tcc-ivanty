const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/mostrar', pedidoController.listarPedidos);

// Criação de um pedido
router.post('/criar', pedidoController.criarPedido);

// Visualização de um pedido
router.get('/:id', pedidoController.exibirPedido);

// Atualizar status do pedido
router.put('/:id/status', pedidoController.atualizarStatus);

module.exports = router;
