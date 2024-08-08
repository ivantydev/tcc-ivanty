const CarrinhoModel = require('../models/carrinhoModel');

const carrinhoController = {
  addItemToCarrinho: async (req, res) => {
    try {
      const { id_cliente, id_obra, quantidade } = req.body;
      const carrinhoId = await CarrinhoModel.addItemToCarrinho(id_cliente, id_obra, quantidade);

      res.status(201).json({ message: 'Item adicionado ao carrinho', carrinhoId });
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getCarrinhoByClienteId: async (req, res) => {
    try {
      const { id_cliente } = req.params;
      const carrinho = await CarrinhoModel.getCarrinhoByClienteId(id_cliente);
      res.status(200).json(carrinho);
    } catch (error) {
      console.error('Erro ao obter carrinho do cliente:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  deleteItemFromCarrinho: async (req, res) => {
    try {
      const { id_carrinho } = req.params;
      const deletedRows = await CarrinhoModel.deleteItemFromCarrinho(id_carrinho);

      if (deletedRows > 0) {
        res.status(200).json({ message: 'Item removido do carrinho' });
      } else {
        res.status(404).json({ message: 'Item não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = carrinhoController;
