const pool = require('./../../config/pool_conexoes');

const PedidoModel = {
  createPedido: async (pedido) => {
    const { id_cliente, total_pedido, obras } = pedido;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [resultPedido] = await connection.query('INSERT INTO Pedidos (id_cliente, total_pedido) VALUES (?, ?)', [id_cliente, total_pedido]);

      for (let obra of obras) {
        await connection.query('INSERT INTO PedidoObras (id_pedido, id_obra, quantidade) VALUES (?, ?, ?)', [resultPedido.insertId, obra.id_obra, obra.quantidade]);
      }

      await connection.commit();
      return resultPedido.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getPedidosByClienteId: async (id_cliente) => {
    const [rows] = await pool.query('SELECT * FROM Pedidos WHERE id_cliente = ?', [id_cliente]);
    return rows;
  }
};

module.exports = PedidoModel;
