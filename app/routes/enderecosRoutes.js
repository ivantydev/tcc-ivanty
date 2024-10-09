const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const isAuthenticated = require('../middlewares/isAuthenticated');

const authorizeAdmin = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente && req.session.cliente.tipo_cliente === 'adm') {
        next();  // Admin autorizado, segue para a próxima função
    } else {
        req.session.notification = {
            message: 'Acesso negado!',
            type: 'error'
        };
        // Redireciona para a página principal ou outra rota
        return res.redirect('/');  // sem passar o notification aqui
    }
};


// Rotas para Endereços
router.post('/enderecos', enderecoController.createEndereco);
router.get('/enderecos', authorizeAdmin, enderecoController.getAllEnderecos);
router.put('/enderecos/:id', enderecoController.updateEndereco);
router.delete('/enderecos/:id', enderecoController.deleteEndereco);

module.exports = router;
