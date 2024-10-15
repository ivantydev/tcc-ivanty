// routes/carrinhoRoutes.js
const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

// Rota para adicionar uma obra ao carrinho
router.post('/carrinho/adicionar/:id', carrinhoController.adicionarAoCarrinho);

// Rota para visualizar o carrinho
router.get('/carrinho', carrinhoController.visualizarCarrinho);

// Rota para remover uma obra do carrinho
router.post('/carrinho/remover/:id', carrinhoController.removerDoCarrinho);

module.exports = router;
