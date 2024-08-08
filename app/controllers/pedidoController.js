const PedidoModel = require('../models/pedidoModel');

const pedidoController = {
  createPedido: async (req, res) => {
    try {
      const { id_cliente, total_pedido, obras } = req.body;
      const pedidoId = await PedidoModel.createPedido({ id_cliente, total_pedido, obras });

      res.status(201).json({ message: 'Pedido criado com sucesso', pedidoId });
    } catch (error) {
      console.error('Erro ao criar pedido:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getPedidosByClienteId: async (req, res) => {
    try {
      const { id_cliente } = req.params;
      const pedidos = await PedidoModel.getPedidosByClienteId(id_cliente);
      res.status(200).json(pedidos);
    } catch (error) {
      console.error('Erro ao obter pedidos do cliente:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = pedidoController;
