const pool = require('../../config/pool_conexoes');

const CarrinhoModel = {
  addItemToCarrinho: async (id_cliente, id_obra, quantidade) => {
    const [result] = await pool.query('INSERT INTO Carrinho (id_cliente, id_obra, quantidade) VALUES (?, ?, ?)', [id_cliente, id_obra, quantidade]);
    return result.insertId;
  },

  getCarrinhoByClienteId: async (id_cliente) => {
    const [rows] = await pool.query('SELECT * FROM Carrinho WHERE id_cliente = ?', [id_cliente]);
    return rows;
  },

  deleteItemFromCarrinho: async (id_carrinho) => {
    const [result] = await pool.query('DELETE FROM Carrinho WHERE id_carrinho = ?', [id_carrinho]);
    return result.affectedRows;
  }
};

module.exports = CarrinhoModel;
