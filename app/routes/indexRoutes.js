const express = require('express');
const obraController = require('../controllers/obraController');
const clienteModel = require('../models/clienteModel');
const router = express.Router();
const ClienteController = require('./../controllers/clienteController');
const ObraModel = require('../models/obraModel');
const carrinhoController = require('../controllers/carrinhoController');
const pedidoController = require('../controllers/pedidoController');

const authenticateUser = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente) {
        next();
    } else {
        res.redirect('/login');
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.cliente && req.session.cliente.tipo_cliente === 'adm') {
        next();
    } else {
        res.redirect('/login');
    }
};

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

router.get('/profile', authenticateUser, (req, res) => {
    const cliente = req.session.cliente;
    const notification = req.session.notification || null; // Ou outra lógica para definir notification
    const endereco = req.session.endereco || null; 
    delete req.session.notification;

    if (cliente.tipo_cliente === 'artista') {
        res.render('pages/profile/artistProfile', { isLoggedIn: true, cliente, notification, endereco });
        req.session.save(); // Garantir que a sessão seja salva
    
    } else if (cliente.tipo_cliente === 'adm') { 
        req.session.save(); // Garantir que a sessão seja salva
        return res.redirect('/adm');
    } else {
        res.render('pages/profile/profile', { isLoggedIn: true, cliente, notification, endereco });
        req.session.save(); // Garantir que a sessão seja salva
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

router.get('/paintings', obraController.listarObras);

router.post('/carrinho/adicionar/:id', carrinhoController.adicionarAoCarrinho);

// Rota para visualizar o carrinho
router.get('/carrinho', carrinhoController.visualizarCarrinho);

// Rota para remover do carrinho
router.post('/carrinho/remover/:id', carrinhoController.removerDoCarrinho);

router.get('/pedidos', authenticateUser, pedidoController.listarPedidos)

router.get('/:username',
    ClienteController.getArtistaByUsername,
    (req, res) => {
        const artista = req.artista;
        const obras = req.obras;  // Obtenha as obras do objeto de requisição
        res.render('pages/artist', { artista, obras });
    }
);

// Rota para exibir uma obra pelo ID
router.get('/obra/:id', 
    async (req, res) => {
        try {
            const obraId = req.params.id;
            const obra = await ObraModel.getObraById(obraId); // Chame a função do model para obter a obra

            if (!obra) {
                return res.status(404).json({ message: 'Obra não encontrada' });
            }

            res.render('pages/obra', { obra }); // Renderize a página com os dados da obra
        } catch (error) {
            console.error('Erro ao obter obra:', error.message);
            res.status(500).json({ error: 'Erro ao obter obra' });
        }
    }
);

module.exports = router;
