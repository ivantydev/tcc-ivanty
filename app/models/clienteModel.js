const pool = require('./../../config/pool_conexoes');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const ClienteModel = {
  getAllClientes: async (page = 1, limit = 24) => {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query('SELECT SQL_CALC_FOUND_ROWS * FROM Clientes LIMIT ? OFFSET ?', [limit, offset]);
    const [totalRows] = await pool.query('SELECT FOUND_ROWS() as total');
    return { clientes: rows, total: totalRows[0].total };
  },

  getClienteById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id]);
    return rows[0];
  },

  createCliente: async (cliente) => {
    const { nome_cliente, email_cliente, cpf_cliente, senha_cliente, datanasc_cliente, perfil_cliente, telefone_cliente, tipo_cliente } = cliente;

    const hashedPassword = await bcrypt.hash(senha_cliente, saltRounds);
    const [resultCliente] = await pool.query('INSERT INTO Clientes SET ?', {
      nome_cliente,
      email_cliente,
      cpf_cliente,
      senha_cliente: hashedPassword, // Armazena a senha criptografada
      datanasc_cliente,
      perfil_cliente,
      telefone_cliente,
      tipo_cliente
    });

    return resultCliente.insertId;
  },

  updateCliente: async (id, updatedCliente) => {
    const query = `
      UPDATE Clientes
      SET nome_cliente = ?,
          perfil_cliente = ?,
          telefone_cliente = ?
      WHERE id_cliente = ?
    `;
    const values = [
      updatedCliente.nome_cliente,
      updatedCliente.perfil_cliente,
      updatedCliente.telefone_cliente,
      id
    ];

    const [result] = await pool.query(query, values);
    return result.affectedRows;
  },

  deleteCliente: async (id) => {
    const [result] = await pool.query('DELETE FROM Clientes WHERE id_cliente = ?', [id]);
    return result.affectedRows;
  },

  getClienteByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE email_cliente = ?', [email]);
    return rows[0];
  },

  updateFotoCliente: async (clienteId, fileName) => {
    const query = `
        UPDATE Clientes
        SET foto_cliente = ?
        WHERE id_cliente = ?
    `;
    const values = [fileName, clienteId];
    const [result] = await pool.query(query, values);
    return result.affectedRows;
  },

  getArtistas: async () => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE tipo_cliente = "artista"');
    return rows;
  },

  getAllClientesByType: async (tipo_cliente, page = 1, limit = 24) => {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query('SELECT SQL_CALC_FOUND_ROWS * FROM Clientes WHERE tipo_cliente = ? LIMIT ? OFFSET ?', [tipo_cliente, limit, offset]);
    const [totalRows] = await pool.query('SELECT FOUND_ROWS() as total');
    return { clientes: rows, total: totalRows[0].total };
  },
};

module.exports = ClienteModel;
