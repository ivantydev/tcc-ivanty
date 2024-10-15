const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rota para criar pedido
router.post('/criar-pedido', pedidoController.criarPedido);

// Rota para exibir pedido por ID
router.get('/pedido/:id', pedidoController.exibirPedido);

// Rota para listar pedidos do cliente
router.get('/pedidos', pedidoController.listarPedidos);

// Rota para feedback de pagamento
router.get('/pagamento/sucesso', pedidoController.feedbackPagamento);
router.get('/pagamento/falha', pedidoController.feedbackPagamento);
router.get('/pagamento/pendente', pedidoController.feedbackPagamento);

module.exports = router;
