const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// Rota para o formulário de solicitação de recuperação de senha
router.get('/password-reset', passwordController.showRequestForm);
router.post('/password-reset', passwordController.handleRequest);

// Rota para o formulário de redefinição de senha
router.get('/password-reset/:token', passwordController.showResetForm);
router.post('/password-reset/:token', passwordController.handleReset);

module.exports = router;
