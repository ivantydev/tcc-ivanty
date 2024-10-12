const express = require('express');
const router = express.Router();
const ObraController = require('../controllers/obraController');
const ObraModel = require('../models/obraModel'); // Importe o modelo ObraModel
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/artista_obras',  isAuthenticated, ObraController.getObrasByArtista);

router.get('/artista/obras/nova', isAuthenticated, (req, res) => {
  res.render('pages/novaObra'); // Renderiza o formulário para adicionar nova obra
});

router.post('/artista/obras/salvar', isAuthenticated, ObraController.saveObraInSession);

router.post('/artista/obras/upload-imagem', isAuthenticated, ObraController.uploadImagem);

router.get('/artista/obras/editar/:id', isAuthenticated, async (req, res) => {
  try {
    const obra = await ObraModel.getObraById(req.params.id); // Chama o modelo para obter a obra
    if (!obra) {
      return res.status(404).send('Obra não encontrada');
    }
    res.render('pages/editarObra', { obra });
  } catch (error) {
    res.status(500).send('Erro ao buscar obra');
  }
});

router.post('/artista/obras/editar/:id', isAuthenticated, ObraController.updateObra);

router.post('/artista/obras/:id/delete', isAuthenticated, ObraController.deleteObra);

module.exports = router;
