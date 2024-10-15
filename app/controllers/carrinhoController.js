// controllers/carrinhoController.js
const obraModel = require('../models/obraModel');

const carrinhoController = {
  // Adicionar obra ao carrinho
  adicionarAoCarrinho: async (req, res) => {
    const obraId = req.params.id;

    // Inicializa o carrinho na sessão, se não existir
    if (!req.session.carrinho) {
      req.session.carrinho = [];
    }

    try {
      // Obtém a obra do banco de dados
      const obra = await obraModel.getObraById(obraId);

      // Verifica se a obra foi encontrada
      if (!obra) {
        return res.status(404).json({ message: 'Obra não encontrada' });
      }

      // Checa se a obra já está no carrinho
      const itemExistente = req.session.carrinho.find(item => item.id_obra === obra.id_obra);

      if (itemExistente) {
        // Aumenta a quantidade se já estiver no carrinho
        itemExistente.quantidade += 1; 
      } else {
        // Adiciona a obra ao carrinho
        req.session.carrinho.push({
          id_obra: obra.id_obra,
          titulo: obra.titulo_obra,
          preco: parseFloat(obra.preco) || 0, // Certifique-se de que o preço é um número
          quantidade: 1,
        });
      }

      // Redireciona para a visualização do carrinho
      res.redirect('/carrinho'); 
    } catch (error) {
      console.error('Erro ao adicionar obra ao carrinho:', error.message);
      res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
    }
  },

  // Visualizar carrinho
  visualizarCarrinho: (req, res) => {
    const carrinho = req.session.carrinho || [];
    res.render('pages/carrinho', { carrinho }); // Renderiza a página do carrinho com os itens
  },

  // Remover obra do carrinho
  removerDoCarrinho: (req, res) => {
    const obraId = req.params.id; // Obtenha o ID da obra a ser removida

    // Filtra o carrinho para remover a obra com o ID correspondente
    req.session.carrinho = req.session.carrinho.filter(item => item.id_obra !== obraId);

    // Redireciona para a página do carrinho
    res.redirect('/carrinho');
  },
};

module.exports = carrinhoController;
