const db = require('../../config/pool_conexoes'); // Supondo que já existe uma configuração de banco de dados

const pedidoModel = {
  // Criar pedido com base no carrinho e detalhes de pagamento
  criarPedido: async (idCliente, statusPagamento, idPagamento, carrinho) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction(); // Iniciar transação para consistência

      // Calcular o preço total do pedido
      const precoTotal = carrinho.reduce((total, obra) => {
        return total + (obra.preco * obra.quantidade);
      }, 0);

      // Inserir o pedido na tabela `pedidos`
      const [result] = await conn.query(
        `INSERT INTO Pedidos (id_cliente, status_pagamento, id_pagamento, preco_total, status_pedido)
         VALUES (?, ?, ?, ?, 'pendente')`, // Status inicial do pedido é 'pendente'
        [idCliente, statusPagamento, idPagamento, precoTotal]
      );

      const pedidoId = result.insertId;

      // Inserir cada obra na tabela `pedidos_obras`
      for (let item of carrinho) {
        await conn.query(
          `INSERT INTO Pedidos_obras (id_pedido, id_obra, quantidade, preco_unitario)
           VALUES (?, ?, ?, ?)`,
          [pedidoId, item.id, item.quantidade, item.preco]
        );
      }

      await conn.commit(); // Confirmar a transação

      return pedidoId;
    } catch (error) {
      await conn.rollback(); // Reverter a transação em caso de erro
      throw error;
    } finally {
      conn.release();
    }
  },

  // Obter pedido pelo ID
  getPedidoById: async (pedidoId) => {
    const conn = await db.getConnection();
    try {
      // Buscar detalhes do pedido
      const [pedido] = await conn.query(
        `SELECT * FROM Pedidos WHERE id_pedido = ?`,
        [pedidoId]
      );

      // Buscar obras associadas ao pedido
      const [obras] = await conn.query(
        `SELECT o.id_obra, o.titulo_obra, po.quantidade, po.preco_unitario AS preco
         FROM Obras o
         INNER JOIN Pedidos_obras po ON o.id_obra = po.id_obra
         WHERE po.id_pedido = ?`,
        [pedidoId]
      );

      return { pedido: pedido[0], obras };
    } finally {
      conn.release();
    }
  },

  // Atualizar status do pedido
  atualizarStatusPedido: async (pedidoId, statusPedido) => {
    const conn = await db.getConnection();
    try {
      await conn.query(
        `UPDATE Pedidos SET status_pedido = ? WHERE id_pedido = ?`,
        [statusPedido, pedidoId]
      );
    } finally {
      conn.release();
    }
  },

  // Listar pedidos por cliente
  getPedidosByClienteId: async (idCliente) => {
    const conn = await db.getConnection();
    try {
      const [pedidos] = await conn.query(
        `SELECT * FROM Pedidos WHERE id_cliente = ?`,
        [idCliente]
      );
      return pedidos;
    } finally {
      conn.release();
    }
  },
};

module.exports = pedidoModel;
