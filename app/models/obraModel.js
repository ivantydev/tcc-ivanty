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
    const [result] = await db.query('INSERT INTO obras SET ?', obraData);
    return result.insertId;
  },

  updateObra: async (id, obraData) => {
    const [result] = await db.query('UPDATE obras SET ? WHERE id_obra = ?', [obraData, id]);
    return result.affectedRows;
  },

  deleteObra: async (id) => {
    const [result] = await db.query('DELETE FROM obras WHERE id_obra = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = ObraModel;
