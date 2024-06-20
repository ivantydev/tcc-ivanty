const pool = require('../../config/pool_conexoes');

const ContatoModel = {
  getAllContatos: async () => {
    const [rows] = await pool.query('SELECT * FROM Contatos');
    return rows;
  },

  getContatoById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM Contatos WHERE id_contato = ?', [id]);
    return rows[0];
  },

  createContato: async (contato) => {
    const { celular_contato, email_contato, tipo_contato } = contato;
    const result = await pool.query('INSERT INTO Contatos SET ?', {
      celular_contato,
      email_contato,
      tipo_contato
    });
    return result.insertId;
  },

  updateContato: async (id, contato) => {
    const { celular_contato, email_contato, tipo_contato } = contato;
    const result = await pool.query('UPDATE Contatos SET ? WHERE id_contato = ?', [{
      celular_contato,
      email_contato,
      tipo_contato
    }, id]);
    return result.affectedRows;
  },

  deleteContato: async (id) => {
    const result = await pool.query('DELETE FROM Contatos WHERE id_contato = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = ContatoModel;
