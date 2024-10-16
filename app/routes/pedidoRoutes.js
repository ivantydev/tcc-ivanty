const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Rota para criar pedido
router.post('/criar-pedido', isAuthenticated, pedidoController.criarPedido);

// Rota para exibir pedido por ID
router.get('/pedido/:id', isAuthenticated, pedidoController.exibirPedido);

// Rota para listar pedidos do cliente
router.get('/pedidos', isAuthenticated, pedidoController.listarPedidos);

router.post('/pedido/cancelar/:id', isAuthenticated, pedidoController.cancelarPedido);

// Rota para feedback de pagamento
router.get('/pagamento/sucesso', pedidoController.feedbackPagamento);
router.get('/pagamento/falha', pedidoController.feedbackPagamento);
router.get('/pagamento/pendente', pedidoController.feedbackPagamento);

module.exports = router;
