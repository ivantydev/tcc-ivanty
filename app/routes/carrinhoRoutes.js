const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

router.post('/carrinho', carrinhoController.addItemToCarrinho);
router.get('/carrinho/:id_cliente', carrinhoController.getCarrinhoByClienteId);
router.delete('/carrinho/:id_carrinho', carrinhoController.deleteItemFromCarrinho);

module.exports = router;
