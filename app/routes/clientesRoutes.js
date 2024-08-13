const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const validateCadastroCliente = require('../middlewares/validateCadastroCliente');
const validateLoginCliente = require('../middlewares/validateLoginCliente');
const { validationResult } = require('express-validator');
const ClienteModel = require('../models/clienteModel');
const multer = require('multer');
const path = require('path');

// Middleware para lidar com erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Erros de validação:', errors.array());
    return res.status(400).json({ errors: errors.array(), formData: req.body });
  }
  next();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, '../public/uploads/'); // Garante um caminho absoluto
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware para verificar se o usuário está autenticado
const authenticateUser = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.cliente) {
    next(); // Se estiver autenticado, continua para a próxima rota
  } else {
    res.redirect('/login'); // Se não estiver autenticado, redireciona para a página de login
  }
};

// Rota para listar todos os clientes
router.get('/clientes', isAuthenticated, ClienteController.getAllClientes);

// Rota para obter um cliente pelo ID
router.get('/clientes/:id', isAuthenticated, ClienteController.getClienteById);

// Rota para cadastrar um novo cliente
router.post('/clientes', validateCadastroCliente, handleValidationErrors, ClienteController.createCliente);

// Rota para atualizar um cliente pelo ID
router.put('/clientes/:id', isAuthenticated, ClienteController.updateCliente);

// Rota para deletar um cliente pelo ID
router.delete('/clientes/:id', isAuthenticated, ClienteController.deleteCliente);

// Rota para login de cliente
router.post('/clientes/login', validateLoginCliente, handleValidationErrors, ClienteController.loginCliente);

// Rota para logout de cliente
router.post('/clientes/logout', isAuthenticated, ClienteController.logoutCliente);

// Rota para carregar formulário de edição de perfil
router.get('/clientes/edit-profile/:id', authenticateUser, async (req, res) => {
  try {
    const cliente = await ClienteModel.getClienteById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.render('edit-profile', { cliente }); // Renderiza o formulário de edição de perfil com os dados do cliente
  } catch (error) {
    console.error('Erro ao carregar página de edição de perfil:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota para processar a atualização de perfil
router.post('/clientes/edit-profile/:id', authenticateUser, async (req, res) => {
  try {
    const clienteId = req.params.id;
    const updatedCliente = {
      nome_cliente: req.body.nome_cliente,
      perfil_cliente: req.body.perfil_cliente,
      telefone_cliente: req.body.telefone_cliente
    };

    const updatedRows = await ClienteModel.updateCliente(clienteId, updatedCliente);

    if (updatedRows > 0) {
      req.session.cliente.nome = updatedCliente.nome_cliente; // Atualiza o nome na sessão
      req.session.successMessage = 'Perfil atualizado com sucesso';
      res.redirect('/profile'); // Redireciona para a página de perfil
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Rota para upload de foto de perfil
router.post('/clientes/uploadfoto', isAuthenticated, upload.single('foto_cliente'), ClienteController.uploadFoto);

module.exports = router;
