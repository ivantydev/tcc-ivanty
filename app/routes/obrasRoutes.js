const express = require('express');
const router = express.Router();
const ObraController = require('../controllers/obraController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Rota para salvar os dados da obra na sessão
router.post('/obras/salvar', isAuthenticated, ObraController.saveObraInSession);

// Nova rota para renderizar a página de upload de imagem
router.get('/obras/upload-imagem', isAuthenticated, (req, res) => {
  res.render('uploadImagem'); // Renderize o arquivo EJS que contém o formulário de upload de imagem
});

// Rota para fazer o upload da imagem e criar a obra
router.post('/obras/imagem', isAuthenticated, ObraController.uploadImagem);

// Outras rotas
router.get('/obras/:id', isAuthenticated, ObraController.getObraById);
router.put('/obras/:id', isAuthenticated, ObraController.updateObra);
router.delete('/obras/:id', isAuthenticated, ObraController.deleteObra);
router.get('/obras', isAuthenticated, ObraController.getAllObras);

module.exports = router;
