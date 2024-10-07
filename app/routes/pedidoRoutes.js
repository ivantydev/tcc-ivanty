const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Criação de um pedido (POST para criar um novo pedido)
router.post('/criar', pedidoController.criarPedido);

// Visualização de um pedido específico (GET para exibir um pedido pelo ID)
router.get('/:id', pedidoController.exibirPedido);

// Atualização do status de um pedido específico (PUT para atualizar o status do pedido)
router.put('/:id/status', pedidoController.atualizarStatus);

router.post('/pagamento', pedidoController.processarPagamento);

module.exports = router;
