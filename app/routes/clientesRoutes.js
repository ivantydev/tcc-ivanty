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
    const uploadPath = path.resolve(__dirname, '../public/uploads/'); 
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const authenticateUser = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.cliente) {
    next(); 
  } else {
    res.redirect('/login');
  }
};

router.get('/clientes', isAuthenticated, ClienteController.getAllClientes);

router.get('/clientes/:id', isAuthenticated, ClienteController.getClienteById);

router.post('/clientes', validateCadastroCliente, handleValidationErrors, ClienteController.createCliente);

router.put('/clientes/:id', isAuthenticated, ClienteController.updateCliente);

router.delete('/clientes/:id', isAuthenticated, ClienteController.deleteCliente);

router.post('/clientes/login', validateLoginCliente, handleValidationErrors, ClienteController.loginCliente);

router.post('/clientes/logout', isAuthenticated, ClienteController.logoutCliente);

router.get('/clientes/edit-profile/:id', authenticateUser, async (req, res) => {
  try {
    const cliente = await ClienteModel.getClienteById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.render('edit-profile', { cliente }); 
  } catch (error) {
    console.error('Erro ao carregar página de edição de perfil:', error.message);
    res.status(500).json({ error: error.message });
  }
});

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
      req.session.cliente.nome = updatedCliente.nome_cliente; 
      req.session.successMessage = 'Perfil atualizado com sucesso';
      res.redirect('/profile'); 
    } else {
      res.status(404).json({ message: 'Cliente não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/clientes/uploadfoto', isAuthenticated, upload.single('foto_cliente'), ClienteController.uploadFoto);

router.get('/artistas', ClienteController.getArtistas);

router.get('/artista/:id_cliente/obras-vendidas', ClienteController.getObrasVendidas);

router.post('/obras-vendidas/:id_cliente/', ClienteController.getObrasVendidas);

module.exports = router;
