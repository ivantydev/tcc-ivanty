const express = require('express');
const router = express.Router();
const ObraController = require('../controllers/obraController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './app/public/uploads/obras/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rota para obter uma obra pelo ID
router.get('/obras/:id', isAuthenticated, ObraController.getObraById);

// Rota para criar uma nova obra (sem imagem inicialmente)
router.post('/obras', isAuthenticated, ObraController.createObra);

// Rota para fazer upload da imagem da obra (após criação)
router.post('/obras/:id/imagem', isAuthenticated, upload.single('imagem_obra'), ObraController.uploadImagem);

// Rota para atualizar uma obra pelo ID (apenas artistas)
router.put('/obras/:id', isAuthenticated, ObraController.updateObra);

// Rota para deletar uma obra pelo ID (apenas artistas)
router.delete('/obras/:id', isAuthenticated, ObraController.deleteObra);

// Rota para listar todas as obras
router.get('/obras', isAuthenticated, ObraController.getAllObras);

module.exports = router;
