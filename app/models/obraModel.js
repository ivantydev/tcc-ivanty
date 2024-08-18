const db = require('../../config/pool_conexoes');

const ObraModel = {
  getAllObras: async () => {
    const [rows] = await db.query('SELECT * FROM obras');
    return rows;
  },

  getObraById: async (id) => {
    const [rows] = await db.query('SELECT * FROM obras WHERE id_obra = ?', [id]);
    return rows[0];
  },

  createObra: async (obraData) => {
    const { titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente } = obraData;
    const query = `
      INSERT INTO obras (titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [titulo_obra, descricao_obra, ano_criacao, imagem_obra, id_cliente];
  
    const [result] = await db.execute(query, values);
    return result.insertId;
  },

  updateObra: async (id, obraData) => {
    const { titulo_obra, descricao_obra, ano_criacao, imagem_obra } = obraData;
    const query = `
      UPDATE obras
      SET titulo_obra = ?, descricao_obra = ?, ano_criacao = ?, imagem_obra = ?
      WHERE id_obra = ?
    `;
    const values = [titulo_obra, descricao_obra, ano_criacao, imagem_obra, id];
  
    const [result] = await db.execute(query, values);
    return result.affectedRows;
  },

  deleteObra: async (id) => {
    const [result] = await db.query('DELETE FROM obras WHERE id_obra = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = ObraModel;
