const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

router.post('/enderecos', enderecoController.createEndereco);
router.get('/enderecos', enderecoController.getAllEnderecos);
router.get('/enderecos/:id', enderecoController.getEnderecoById);
router.put('/enderecos/:id', enderecoController.updateEndereco);
router.delete('/enderecos/:id', enderecoController.deleteEndereco);

module.exports = router;
