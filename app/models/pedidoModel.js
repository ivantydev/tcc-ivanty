const db = require('../../config/pool_conexoes');

const pedidoModel = {
  // Cria um novo pedido
  criarPedido: async (idCliente, statusPagamento, idPagamento, carrinho) => {
    const statusPedido = 'pendente'; // Padrão como 'pendente'
    const dataPedido = new Date();

    try {
      // Insere o pedido na tabela 'Pedidos'
      const [result] = await db.query(`
        INSERT INTO Pedidos (data_pedido, id_cliente, status_pedido, status_pagamento, id_pagamento)
        VALUES (?, ?, ?, ?, ?)
      `, [dataPedido, idCliente, statusPedido, statusPagamento, idPagamento]);

      const pedidoId = result.insertId;

      // Insere as obras associadas ao pedido na tabela 'Pedidos_Obras'
      for (const item of carrinho) {
        const preco = item.preco || 0; // Garantir que o preço não seja nulo ou indefinido
        await db.query(`
          INSERT INTO Pedidos_Obras (id_pedido, id_obra, quantidade, preco)
          VALUES (?, ?, ?, ?)
        `, [pedidoId, item.id, item.quantidade, preco]);
      }

      return pedidoId;
    } catch (error) {
      throw new Error('Erro ao criar pedido: ' + error.message);
    }
  },

  // Obter pedido por ID
  getPedidoById: async (idPedido) => {
    try {
      const [pedido] = await db.query(`
        SELECT * FROM Pedidos WHERE id_pedido = ?
      `, [idPedido]);

      const [obras] = await db.query(`
        SELECT po.*, o.titulo_obra, o.preco
        FROM Pedidos_Obras po
        JOIN Obras o ON po.id_obra = o.id_obra
        WHERE po.id_pedido = ?
      `, [idPedido]);

      return { pedido: pedido[0], obras };
    } catch (error) {
      throw new Error('Erro ao buscar pedido: ' + error.message);
    }
  },

  // Atualizar status do pedido
  atualizarStatusPedido: async (idPedido, statusPedido) => {
    try {
      await db.query(`
        UPDATE Pedidos SET status_pedido = ? WHERE id_pedido = ?
      `, [statusPedido, idPedido]);
    } catch (error) {
      throw new Error('Erro ao atualizar status do pedido: ' + error.message);
    }
  },

  // Buscar todos os pedidos de um cliente
  getPedidosByClienteId: async (idCliente) => {
    try {
      const [pedidos] = await db.query(`
        SELECT * FROM Pedidos WHERE id_cliente = ?
      `, [idCliente]);

      return pedidos; 
    } catch (error) {
      throw new Error('Erro ao buscar pedidos: ' + error.message);
    }
  },
};

module.exports = pedidoModel;
