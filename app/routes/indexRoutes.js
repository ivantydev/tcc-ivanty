const express = require('express');
const router = express.Router();

// Middleware para verificar se o usuário está autenticado
const authenticateUser = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente) {
        // Se estiver autenticado, continua para a próxima rota
        next();
    } else {
        // Se não estiver autenticado, redireciona para a página de login
        res.redirect('/login');
    }
};

router.get('/', (req, res) => {
    const successMessage = req.session.successMessage;
    // Limpa a mensagem de sucesso da sessão para que não seja exibida novamente
    delete req.session.successMessage;
  
    res.render("pages/index", { successMessage });
});

router.get("/artists", function (req, res) {
    res.render("pages/artists");
});

router.get("/about", function (req, res) {
    res.render("pages/about");
});

// Rota para perfil - requer autenticação
router.get('/profile', authenticateUser, (req, res) => {
    res.render('pages/profile', { isLoggedIn: true, cliente: req.session.cliente });
});

// Rota para fazer logout
router.get('/logout', (req, res) => {
    // Destroi a sessão (limpa todos os dados da sessão)
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
        } else {
            // Redireciona para a página inicial após o logout
            res.redirect('/');
        }
    });
});

// Rota para painel administrativo - requer autenticação
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
