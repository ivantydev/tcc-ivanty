const pedidoModel = require('../models/pedidoModel');
const pagamentoModel = require('../models/pagamentoModel');

const pagamentoController = {
  // Exibir página de pagamento para um pedido
  showPagamento: async (req, res) => {
    const pedidoId = req.params.id;
    try {
      const pedido = await pedidoModel.getPedidoById(pedidoId);

      if (!pedido.pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      // Cria uma preferência de pagamento no Mercado Pago
      const preferencia = await pagamentoModel.criarPreferenciaMP(pedidoId, pedido.obras);

      res.render('pages/pagamento', { preferencia, pedido: pedido.pedido });
      
    } catch (error) {
      console.error('Erro ao exibir pagamento:', error.message);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  },

  // Callback para o Mercado Pago após pagamento
  feedbackPagamento: async (req, res) => {
    const { external_reference, payment_status } = req.query;

    try {
      // Atualiza o status do pedido com base no status do pagamento
      const status = payment_status === 'approved' ? 'pago' : 'pendente';
      await pedidoModel.atualizarStatusPedido(external_reference, status);

      res.redirect('/pedidos'); // Redireciona para a página de pedidos
    } catch (error) {
      console.error('Erro ao processar feedback de pagamento:', error.message);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  },
};

module.exports = pagamentoController;
