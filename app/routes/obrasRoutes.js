const express = require('express');
const router = express.Router();
const ObraController = require('../controllers/obraController');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Middleware para lidar com erros de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/public/uploads/obras/'); // Diretório onde as imagens das obras serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware para verificar se o usuário está autenticado e é um artista
const authenticateArtist = (req, res, next) => {
  if (req.session.isLoggedIn && req.session.cliente && req.session.cliente.tipo_cliente === 'artista') {
    next(); // Se estiver autenticado e for um artista, continua para a próxima rota
  } else {
    res.status(403).json({ message: 'Acesso negado: apenas artistas podem acessar esta rota' }); // Se não estiver autenticado ou não for um artista, retorna um erro
  }
};

// Rota para listar todas as obras
router.get('/obras', isAuthenticated, ObraController.getAllObras);

// Rota para obter uma obra pelo ID
router.get('/obras/:id', isAuthenticated, ObraController.getObraById);

// Rota para criar uma nova obra (apenas artistas)
router.post('/obras', authenticateArtist, upload.single('imagem_obra'), handleValidationErrors, ObraController.createObra);

// Rota para atualizar uma obra pelo ID (apenas artistas)
router.put('/obras/:id', authenticateArtist, handleValidationErrors, ObraController.updateObra);

// Rota para deletar uma obra pelo ID (apenas artistas)
router.delete('/obras/:id', authenticateArtist, ObraController.deleteObra);

module.exports = router;
