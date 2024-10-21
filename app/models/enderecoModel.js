const pool = require('../../config/pool_conexoes');

const EnderecoModel = {
  getAllEnderecos: async () => {
    const [rows] = await pool.query('SELECT * FROM Enderecos');
    return rows;
  },

  getEnderecoById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM Enderecos WHERE id_endereco = ?', [id]);
    return rows[0];
  },

  createEndereco: async (endereco) => {
    const { cep_endereco, numero_endereco, complemento_endereco, tipo_endereco, id_cliente } = endereco;
    const result = await pool.query('INSERT INTO Enderecos SET ?', {
      cep_endereco,
      numero_endereco,
      complemento_endereco,
      tipo_endereco,
      id_cliente
    });
    return result.insertId;
  },

  updateEndereco: async (id, endereco) => {
    const { cep_endereco, numero_endereco, complemento_endereco, tipo_endereco } = endereco;
    const result = await pool.query(
      'UPDATE Enderecos SET cep_endereco = ?, numero_endereco = ?, complemento_endereco = ?, tipo_endereco = ? WHERE id_endereco = ?',
      [cep_endereco, numero_endereco, complemento_endereco, tipo_endereco, id]
    );
    return result.affectedRows;
  },

  deleteEndereco: async (id) => {
    const result = await pool.query('DELETE FROM Enderecos WHERE id_endereco = ?', [id]);
    return result.affectedRows;
  },

  getEnderecoByClienteId: async (id_cliente) => {
    const query = 'SELECT * FROM Enderecos WHERE id_cliente = ?';
    const [rows] = await pool.query(query, [id_cliente]);
    return rows[0]; // Retorna o primeiro resultado ou undefined se não existir
  },
};

module.exports = EnderecoModel;
