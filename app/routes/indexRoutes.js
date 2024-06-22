const express = require('express');
const router = express.Router();

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

router.get('/profile', (req, res) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    const cliente = req.session.cliente || null; // Certifique-se de ajustar de acordo com a estrutura da sua sessão
  
    // Verifica se o usuário está logado e se o cliente está definido na sessão
    if (!isLoggedIn || !cliente) {
      return res.redirect('/login'); // Redireciona para a página de login se não estiver logado
    }
  
    // Renderiza a página profile.ejs passando as informações do cliente
    res.render('pages/profile', { isLoggedIn, cliente });
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

router.get('/adm', function (req, res) {
    res.render("pages/admin/index_adm.ejs")
});

router.get('/register', function (req, res) {
    res.render("pages/cadastro.ejs")
});

router.get('/login', function (req, res) {
    res.render("pages/login.ejs")
});

router.get('/buyitem', function (req, res) {
    res.render("pages/buyitem.ejs")
});

router.get('/card', function (req, res) {
    res.render("pages/card.ejs")
});

router.get('/artist_painel', function (req, res) {
    res.render("pages/artistPainel.ejs")
});

router.get('/artist', function (req, res) {
    res.render("pages/artist.ejs")
});

router.get('/requests', function (req, res) {
    res.render("pages/requests.ejs")
});

module.exports = router;
