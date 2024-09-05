const obraModel = require('../models/obraModel');

const carrinhoController = {
  // Adiciona uma obra ao carrinho
  adicionarAoCarrinho: async (req, res) => {
    const obraId = req.params.id;

    // Verifica se o carrinho já existe na sessão
    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }

    // Busca a obra pelo ID no banco de dados
    try {
      const obra = await obraModel.getObraById(obraId);

      if (!obra) {
        return res.status(404).json({ message: 'Obra não encontrada' });
      }

      // Checa se a obra já está no carrinho
      const itemExistente = req.session.carrinho.find(item => item.id === obra.id_obra);

      if (itemExistente) {
        itemExistente.quantidade += 1; // Aumenta a quantidade se já estiver no carrinho
      } else {
        // Adiciona a obra ao carrinho
        req.session.carrinho.push({
          id: obra.id_obra,
          titulo: obra.titulo_obra,
          preco: obra.preco_obra || 0, // Ajuste se tiver preço
          quantidade: 1,
        });
      }

      res.redirect('/carrinho'); // Redireciona para a visualização do carrinho
    } catch (error) {
      console.error('Erro ao adicionar obra ao carrinho:', error.message);
      res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
    }
  },

  // Exibe o carrinho de compras
  visualizarCarrinho: (req, res) => {
    const carrinho = req.session.carrinho || [];
    res.render('pages/carrinho', { carrinho });
  },

  // Remove uma obra do carrinho
  removerDoCarrinho: (req, res) => {
    const obraId = parseInt(req.params.id, 10);

    req.session.carrinho = req.session.carrinho.filter(item => item.id !== obraId);
    res.redirect('/carrinho');
  },
};

module.exports = carrinhoController;
