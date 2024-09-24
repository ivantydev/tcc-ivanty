const pedidoModel = require('../models/pedidoModel');

const pedidoController = {
  // Cria um pedido a partir do carrinho
  criarPedido: async (req, res) => {
    const carrinho = req.session.carrinho || [];
    const idCliente = req.session.cliente.id; // Assumindo que o cliente já está logado
    const { statusPagamento, idPagamento } = req.body; // Informações de pagamento enviadas pelo cliente

    if (carrinho.length === 0) {
      return res.status(400).json({ message: 'Carrinho está vazio' });
    }

    try {
      const pedidoId = await pedidoModel.criarPedido(idCliente, statusPagamento, idPagamento, carrinho);
      
      // Limpa o carrinho após a criação do pedido
      req.session.carrinho = [];

      res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId });
    } catch (error) {
      console.error('Erro ao criar pedido:', error.message);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  },

  // Exibir um pedido pelo ID
  exibirPedido: async (req, res) => {
    const pedidoId = req.params.id;

    try {
      const pedido = await pedidoModel.getPedidoById(pedidoId);

      if (!pedido.pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      res.render('pages/pedido', { pedido: pedido.pedido, obras: pedido.obras });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error.message);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  },

  // Atualizar o status de um pedido (ex: de "pendente" para "pago")
  atualizarStatus: async (req, res) => {
    const pedidoId = req.params.id;
    const { statusPedido } = req.body;

    try {
      await pedidoModel.atualizarStatusPedido(pedidoId, statusPedido);
      res.json({ message: 'Status do pedido atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  },

  listarPedidos: async (req, res) => {
    const idCliente = req.session.cliente.id; // ID do cliente logado
  
    try {
      const pedidos = await pedidoModel.getPedidosByClienteId(idCliente);
  
      res.render('pages/pedidos', { pedidos }); // Renderize a página de pedidos com a lista
    } catch (error) {
      console.error('Erro ao listar pedidos:', error.message);
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  },
};



module.exports = pedidoController;
