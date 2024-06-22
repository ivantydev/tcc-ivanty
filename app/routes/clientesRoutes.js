const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/clientes', isAuthenticated, ClienteController.getAllClientes);
router.get('/clientes/:id', isAuthenticated, ClienteController.getClienteById);
router.post('/clientes', ClienteController.createCliente); // Cadastro de cliente não requer autenticação
router.put('/clientes/:id', isAuthenticated, ClienteController.updateCliente);
router.delete('/clientes/:id', isAuthenticated, ClienteController.deleteCliente);
router.post('/clientes/login', ClienteController.loginCliente);
router.post('/clientes/logout', ClienteController.logoutCliente);

module.exports = router;
