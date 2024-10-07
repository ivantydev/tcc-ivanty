const db = require('../../config/pool_conexoes');

const pedidoModel = {
  criarPedido: async (idCliente, statusPagamento, idPagamento, carrinho) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Calcular o preço total do carrinho
      const precoTotal = carrinho.reduce((total, item) => total + (parseFloat(item.preco) * item.quantidade), 0);

      // Inserir o pedido na tabela Pedidos com o preço total
      const [result] = await connection.query(
        'INSERT INTO Pedidos (id_cliente, status_pagamento, id_pagamento, preco_total) VALUES (?, ?, ?, ?)',
        [idCliente, statusPagamento, idPagamento, precoTotal]
      );

      const pedidoId = result.insertId;

      // Inserir as obras relacionadas ao pedido na tabela Pedidos_obras
      for (const item of carrinho) {
        // Validação dos dados do item
        if (!item.id_obra || !item.quantidade || isNaN(item.quantidade) || !item.preco || isNaN(parseFloat(item.preco))) {
          throw new Error(`Invalid item in cart: ${JSON.stringify(item)}`);
        }

        await connection.query(
          'INSERT INTO Pedidos_obras (id_pedido, id_obra, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
          [pedidoId, item.id_obra, item.quantidade, parseFloat(item.preco)]
        );
      }

      await connection.commit();
      return pedidoId;
    } catch (error) {
      await connection.rollback();
      console.error('Error creating order:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  },

  // Obter pedido pelo ID
  getPedidoById: async (pedidoId) => {
    const [pedido] = await db.query(
      'SELECT * FROM Pedidos WHERE id = ?',
      [pedidoId]
    );
    const [obras] = await db.query(
      'SELECT * FROM Pedidos_obras WHERE pedidoId = ?',
      [pedidoId]
    );
    return { pedido: pedido[0], obras };
  },

  // Atualizar o status de um pedido
  atualizarStatusPedido: async (pedidoId, statusPedido) => {
    await db.query(
      'UPDATE Pedidos SET status_pedido = ? WHERE id = ?',
      [statusPedido, pedidoId]
    );
  },

  // Listar pedidos por cliente
  getPedidosByClienteId: async (idCliente) => {
    const [pedidos] = await db.query(
      'SELECT * FROM Pedidos WHERE id_cliente = ?',
      [idCliente]
    );
    return pedidos;
  },
};

module.exports = pedidoModel;
