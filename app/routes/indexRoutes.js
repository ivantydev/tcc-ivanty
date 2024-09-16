const express = require('express');
const obraController = require('../controllers/obraController');
const clienteModel = require('../models/clienteModel');
const router = express.Router();
const ClienteController = require('./../controllers/clienteController');

// Middleware para verificar se o usuário está autenticado
const authenticateUser = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Middleware para verificar se o usuário é um administrador
const authorizeAdmin = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente && req.session.cliente.tipo_cliente === 'adm') {
        next();
    } else {
        res.redirect('/login');
    }
};

// Rota principal que renderiza a página inicial com obras e artistas
router.get('/', async (req, res) => {
    try {
        const { clientes: artistas } = await clienteModel.getAllClientesByType('artista', 1, 10);
        const successMessage = req.session.successMessage || null; // Usa valor padrão
        delete req.session.successMessage; // Limpa a mensagem de sucesso após o uso
        res.render('pages/index', { artistas, successMessage });
    } catch (error) {
        console.error('Erro ao obter dados:', error.message);
        res.status(500).send('Erro ao obter dados');
    }
});

// Rota para a página de artistas
router.get('/artists', async (req, res) => {
    try {
        // Busca todos os artistas
        const artistas = await clienteModel.getArtistas();

        // Para cada artista, busca as obras relacionadas
        const artistasComObras = await Promise.all(artistas.map(async (artista) => {
            const obras = await clienteModel.getObrasByClienteId(artista.id_cliente);
            return { ...artista, obras }; // Adiciona as obras ao objeto do artista
        }));

        // Renderiza a página com os dados dos artistas e suas obras
        res.render('pages/artists', { artistas: artistasComObras });
    } catch (error) {
        console.error('Erro ao buscar artistas e obras:', error.message);
        res.status(500).send('Erro ao carregar a página de artistas.');
    }
});

// Rota para a página sobre
router.get('/about', (req, res) => {
    res.render('pages/about');
});

// Rota para perfil - requer autenticação e redireciona com base no tipo de cliente
router.get('/profile', authenticateUser, (req, res) => {
    const cliente = req.session.cliente;
    if (cliente.tipo_cliente === 'artista') {
        res.render('pages/profile/artistProfile', { isLoggedIn: true, cliente });
    } else if (cliente.tipo_cliente === 'adm') { 
        res.redirect('/adm');
    }
    else {
        res.render('pages/profile/profile', { isLoggedIn: true, cliente });
    }
});

// Rota para logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
        }
        res.redirect('/');
    });
});

// Rota para admin - requer autenticação e autorização de administrador
router.get('/adm', authenticateUser, authorizeAdmin, (req, res) => {
    res.render('pages/admin/index_adm.ejs');
});

// Rota para registro
router.get('/register', (req, res) => {
    res.render('pages/cadastro.ejs');
});

// Rota para login
router.get('/login', (req, res) => {
    res.render('pages/login.ejs');
});

// Rota para compra de item - requer autenticação
router.get('/buyitem', (req, res) => {
    res.render('pages/buyitem.ejs');
});

// Rota para página de cartão
router.get('/card', (req, res) => {
    res.render('pages/card.ejs');
});

// Rota para painel do artista - requer autenticação
router.get('/artist_painel', authenticateUser, (req, res) => {
    res.render('pages/artistPainel.ejs');
});

// Rota para página de artista
router.get('/artist', (req, res) => {
    res.render('pages/artist.ejs');
});

// Rota para pedidos - requer autenticação
router.get('/requests', authenticateUser, (req, res) => {
    res.render('pages/requests.ejs');
});

// Rota para pedidos - requer autenticação
router.get('/pedidos', authenticateUser, (req, res) => {
    res.render('pages/pedidos.ejs');
});

router.get('/paintings', 
    (req, res) => {
        
        res.render('pages/obras')
    }
)


router.get('/:username',
    ClienteController.getArtistaByUsername,
    (req, res) => {
        const artista = req.artista;
        const obras = req.obras;  // Obtenha as obras do objeto de requisição
        res.render('pages/artist', { artista, obras });
    }
);


router.get('')

module.exports = router;
