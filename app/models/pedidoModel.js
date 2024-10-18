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

  atualizarInitPoint: async (pedidoId, initPoint) => {
    await db.query(
      'UPDATE Pedidos SET init_point = ? WHERE id_pedido = ?',
      [initPoint, pedidoId]
    );
  },


  getPedidoById: async (pedidoId) => {
    const [pedido] = await db.query(
      'SELECT * FROM Pedidos WHERE id_pedido = ?',
      [pedidoId]
    );
    const [obras] = await db.query(
      'SELECT * FROM Pedidos_obras WHERE id_pedido = ?',
      [pedidoId]
    );
    return { pedido: pedido[0], obras };
  },

  atualizarStatusPagamento: async (pedidoId, status_pagamento) => {
    await db.query(
      'UPDATE Pedidos SET status_pagamento = ? WHERE id_pedido = ?',
      [status_pagamento, pedidoId]
    );
  },

  getPedidosByClienteId: async (idCliente) => {
    const [pedidos] = await db.query(
      'SELECT * FROM Pedidos WHERE id_cliente = ?',
      [idCliente]
    );
    return pedidos;
  },

  cancelarPedido: async (pedidoId) => {
    await db.query(
      'UPDATE Pedidos SET status_pedido = ? WHERE id_pedido = ?',
      ['CANCELADO', pedidoId]
    );
  },

  getPedidosParaTela: async (idCliente) => {
    const query = `
      SELECT 
        P.id_pedido,
        P.data_pedido,
        P.status_pagamento,
        P.preco_total,
        O.titulo_obra,
        O.imagem_obra  -- Supondo que você tenha um campo 'imagem_obra' na tabela Obras
      FROM 
        Pedidos P
      JOIN 
        Pedidos_obras PO ON P.id_pedido = PO.id_pedido
      JOIN 
        Obras O ON PO.id_obra = O.id_obra
      WHERE 
        P.id_cliente = ?
      GROUP BY 
        P.id_pedido
      ORDER BY 
        P.data_pedido DESC;
    `;
  
    const [pedidos] = await db.query(query, [idCliente]);
    return pedidos;
  }  
};

module.exports = pedidoModel;
