const db = require('../../config/pool_conexoes');

const ObraModel = {
  getAllObras: async () => {
    const [rows] = await db.query('SELECT * FROM Obras');
    return rows;
  },

  getObraById: async (id) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE id_obra = ?', [id]);
    return rows[0];
  },

  createObra: async (obraData) => {
    const { titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente } = obraData;
    const query = `
      INSERT INTO Obras (titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente];
  
    const [result] = await db.execute(query, values);
    return result.insertId;
  },

  updateObra: async (id, obraData) => {
    const { titulo_obra, descricao_obra, ano_criacao, imagem_obra } = obraData;
    const query = `
      UPDATE Obras
      SET titulo_obra = ?, descricao_obra = ?, ano_criacao = ?, imagem_obra = ?
      WHERE id_obra = ?
    `;
    const values = [titulo_obra, descricao_obra, ano_criacao, imagem_obra, id];
  
    const [result] = await db.execute(query, values);
    return result.affectedRows;
  },

  deleteObra: async (id) => {
    const [result] = await db.query('DELETE FROM Obras WHERE id_obra = ?', [id]);
    return result.affectedRows;
  },

  getObrasByClienteId: async (id_cliente) => {
    const [rows] = await db.query('SELECT * FROM Obras WHERE id_cliente = ?', [id_cliente]);
    return rows;
  }
};

module.exports = ObraModel;
