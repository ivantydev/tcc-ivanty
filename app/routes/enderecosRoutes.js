const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Rotas para Endereços
router.post('/enderecos', isAuthenticated, enderecoController.createEndereco);
router.get('/enderecos', enderecoController.getAllEnderecos);
router.put('/enderecos/:id', enderecoController.updateEndereco);
router.delete('/enderecos/:id', enderecoController.deleteEndereco);

module.exports = router;
