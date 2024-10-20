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
        req.session.notification = {
          message: 'Obra não encontrada',
          type: 'error'
        };
        return res.redirect('/carrinho');
      }

      // Checa se a obra já está no carrinho
      const itemExistente = req.session.carrinho.find(item => item.id_obra === obra.id_obra);

      if (itemExistente) {
        // Aumenta a quantidade se já estiver no carrinho
        itemExistente.quantidade += 1; 
        req.session.notification = {
          message: `Quantidade da obra "${obra.titulo_obra}" aumentada no carrinho`,
          type: 'success'
        };
      } else {
        // Adiciona a obra ao carrinho com a imagem
        req.session.carrinho.push({
          id_obra: obra.id_obra,
          titulo: obra.titulo_obra,
          preco: parseFloat(obra.preco) || 0, // Certifique-se de que o preço é um número
          imagem_obra: obra.imagem_obra, // Salva o caminho da imagem no carrinho
          quantidade: 1,
        });
        req.session.notification = {
          message: `Obra "${obra.titulo_obra}" adicionada ao carrinho`,
          type: 'success'
        };
      }

      // Redireciona para a visualização do carrinho
      res.redirect('/carrinho'); 
    } catch (error) {
      console.error('Erro ao adicionar obra ao carrinho:', error.message);
      req.session.notification = {
        message: 'Erro ao adicionar ao carrinho: ' + error.message,
        type: 'error'
      };
      res.redirect('/carrinho');
    }
  },

  // Visualizar carrinho
  visualizarCarrinho: (req, res) => {
    const carrinho = req.session.carrinho || [];
    const notification = req.session.notification || null;

    // Limpa a notificação depois de exibir
    req.session.notification = null;

    res.render('pages/carrinho', { carrinho, notification }); // Renderiza a página do carrinho com os itens e a notificação
  },

  // Remover obra do carrinho
  removerDoCarrinho: (req, res) => {
    const obraId = parseInt(req.params.id, 10); // Converte o ID da obra para número

    // Filtra o carrinho para remover a obra com o ID correspondente
    const obraRemovida = req.session.carrinho.find(item => item.id_obra === obraId);
    
    if (obraRemovida) {
      req.session.carrinho = req.session.carrinho.filter(item => item.id_obra !== obraId);

      req.session.notification = {
        message: `Obra "${obraRemovida.titulo}" removida do carrinho`,
        type: 'success'
      };
    } else {
      req.session.notification = {
        message: 'Obra não encontrada no carrinho',
        type: 'warning'
      };
    }

    // Redireciona para a página do carrinho
    res.redirect('/carrinho');
  },
};

module.exports = carrinhoController;
