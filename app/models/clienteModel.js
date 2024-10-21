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

  getClienteByCPF: async (cpf) => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE cpf_cliente = ?', [cpf]);
    return rows[0];
  },

  getClienteByPerfil: async (perfil) => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE perfil_cliente = ?', [perfil]);
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

  getArtistaByUsername: async (username) => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE tipo_cliente = "artista" AND perfil_cliente = ?', [username]);
    return rows[0];
  },

  getObrasByClienteId: async (id_cliente) => {
    const [rows] = await pool.query('SELECT * FROM Obras WHERE id_cliente = ?', [id_cliente]);
    return rows;
  },

  async getArtistasComObras() {
    const query = `
        SELECT 
            c.id_cliente, 
            c.nome_cliente, 
            c.perfil_cliente,
            c.foto_cliente,
            o.id_obra, 
            o.titulo_obra, 
            o.descricao_obra,
            o.imagem_obra
        FROM 
            Clientes AS c
        INNER JOIN 
            Obras AS o ON c.id_cliente = o.id_cliente
        WHERE 
            o.status_obra = 1
    `;
    const [rows] = await pool.execute(query); 
    return rows;
  },

  // Função para atualizar a senha do cliente (usado na recuperação de senha)
  updatePassword: async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const query = 'UPDATE Clientes SET senha_cliente = ? WHERE email_cliente = ?';

    try {
      const [result] = await pool.query(query, [hashedPassword, email]);
      return result.affectedRows;
    } catch (error) {
      console.error('Erro ao atualizar a senha do cliente:', error);
      throw error;
    }
  },

  getClienteByTelefone: async (telefone) => {
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE telefone_cliente = ?', [telefone]);
    return rows[0]; // Retorna o cliente se encontrado, ou undefined
  },
};

module.exports = ClienteModel;
