const express = require('express');
const router = express.Router();
const ObraController = require('../controllers/obraController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const ObraModel = require('./../models/obraModel');

// Rota para salvar os dados da obra na sessão
router.post('/obras/salvar', isAuthenticated, ObraController.saveObraInSession);

// Nova rota para renderizar a página de upload de imagem
router.get('/obras/upload-imagem', isAuthenticated, (req, res) => {
  res.render('pages/uploadImagem'); // Renderize o arquivo EJS que contém o formulário de upload de imagem
});

// Rota para fazer o upload da imagem e criar a obra
router.post('/obras/imagem', isAuthenticated, ObraController.uploadImagem);

// Outras rotas
router.get('/obras/:id', isAuthenticated, ObraController.getObraById);
router.put('/obras/:id', isAuthenticated, ObraController.updateObra);
router.delete('/obras/:id', isAuthenticated, ObraController.deleteObra);
router.get('/obras', isAuthenticated, ObraController.getAllObras);

router.get('/salvar', isAuthenticated, (req, res) => {
    res.render('pages/salvarObra');
});

router.post('/salvar', isAuthenticated, ObraController.saveObraInSession);

router.get('/upload-imagem', isAuthenticated, (req, res) => {
    res.render('pages/uploadImagem');
});

router.post('/imagem', isAuthenticated, ObraController.uploadImagem);

router.get('/obras/categoria/:categoria', async (req, res) => {
  try {
      const { categoria } = req.params;
      const obras = await ObraModel.getObrasByCategoria(categoria);
      
      // Retorna as obras em formato JSON
      res.json(obras);
  } catch (error) {
      console.error('Erro ao buscar obras por categoria:', error.message);
      res.status(500).json({ error: 'Erro ao carregar as obras por categoria.' });
  }
});


module.exports = router;
