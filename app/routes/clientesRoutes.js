const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const validateCadastroCliente = require('../middlewares/validateCadastroCliente');
const validateLoginCliente = require('../middlewares/validateLoginCliente');
const { validationResult } = require('express-validator');

// Middleware para lidar com erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/clientes', isAuthenticated, ClienteController.getAllClientes);
router.get('/clientes/:id', isAuthenticated, ClienteController.getClienteById);
router.post('/clientes', validateCadastroCliente, handleValidationErrors, ClienteController.createCliente); // Cadastro de cliente não requer autenticação
router.put('/clientes/:id', isAuthenticated, ClienteController.updateCliente);
router.delete('/clientes/:id', isAuthenticated, ClienteController.deleteCliente);
router.post('/clientes/login', validateLoginCliente, handleValidationErrors, ClienteController.loginCliente);
router.post('/clientes/logout', isAuthenticated, ClienteController.logoutCliente);

module.exports = router;
