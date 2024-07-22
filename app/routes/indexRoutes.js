const express = require('express');
const obraController = require('../controllers/obraController');
const router = express.Router();

// Middleware para verificar se o usuário está autenticado
const authenticateUser = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente) {
        next();
    } else {
        res.redirect('/login');
    }
};

router.get('/', async (req, res) => {
    try {
        const obras = await obraController.getAllObras();
        const successMessage = req.session.successMessage;
        delete req.session.successMessage;
        res.render('pages/index', { obras, successMessage });
    } catch (error) {
        console.error('Erro ao obter todas as obras:', error.message);
        res.status(500).send('Erro ao obter obras');
    }
});

router.get("/artists", function (req, res) {
    res.render("pages/artists");
});

router.get("/about", function (req, res) {
    res.render("pages/about");
});

// Rota para perfil - requer autenticação e redireciona com base no tipo de cliente
router.get('/profile', authenticateUser, (req, res) => {
    if (req.session.cliente.tipo_cliente === 'artista') {
        res.render('pages/profile/artistProfile', { isLoggedIn: true, cliente: req.session.cliente });
    } else {
        res.render('pages/profile/profile', { isLoggedIn: true, cliente: req.session.cliente });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
        } else {
            res.redirect('/');
        }
    });
});

router.get('/adm', authenticateUser, function (req, res) {
    res.render("pages/admin/index_adm.ejs");
});

router.get('/register', function (req, res) {
    res.render("pages/cadastro.ejs");
});

router.get('/login', function (req, res) {
    res.render("pages/login.ejs");
});

router.get('/buyitem', authenticateUser, function (req, res) {
    res.render("pages/buyitem.ejs");
});

router.get('/card', function (req, res) {
    res.render("pages/card.ejs");
});

router.get('/artist_painel', authenticateUser, function (req, res) {
    res.render("pages/artistPainel.ejs");
});

router.get('/artist', function (req, res) {
    res.render("pages/artist.ejs");
});

router.get('/requests', authenticateUser, function (req, res) {
    res.render("pages/requests.ejs");
});

module.exports = router;
