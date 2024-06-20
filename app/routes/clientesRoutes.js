const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

router.get('/clientes', ClienteController.getAllClientes);
router.get('/clientes/:id', ClienteController.getClienteById);
router.post('/clientes', ClienteController.createCliente);
router.put('/clientes/:id', ClienteController.updateCliente);
router.delete('/clientes/:id', ClienteController.deleteCliente);
router.post('/clientes/login', ClienteController.loginCliente);

module.exports = router;
