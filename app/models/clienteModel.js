const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rounds de salt para hashing com bcrypt
const pool = require('./../../config/pool_conexoes'); // Importe o objeto de conexão

const ClienteModel = {
  getAllClientes: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM Clientes');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getClienteById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createCliente: async (cliente) => {
    const { nome_cliente, email_cliente, cpf_cliente, senha_cliente, datanasc_cliente, perfil_cliente, cep_endereco, numero_endereco, complemento_endereco, tipo_endereco, telefone_cliente, tipo_cliente } = cliente;

    try {
      // Validate mandatory fields
      if (!nome_cliente || !email_cliente || !cpf_cliente || !senha_cliente || !datanasc_cliente || !cep_endereco || !numero_endereco || !tipo_endereco) {
        throw new Error('Todos os campos são obrigatórios');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(senha_cliente, saltRounds);

      // Start a transaction
      await pool.query('START TRANSACTION');

      // 1. Create the address
      const [resultEndereco] = await pool.query('INSERT INTO Enderecos SET ?', {
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco
      });
      const Enderecos_id_endereco = resultEndereco.insertId;

      // 2. Create the client using the ID of the created address and hashed password
      const [resultCliente] = await pool.query('INSERT INTO Clientes SET ?', {
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente: hashedPassword, // Store hashed password
        datanasc_cliente,
        Enderecos_id_endereco,
        perfil_cliente,
        telefone_cliente,
        tipo_cliente
      });

      // Commit the transaction if everything goes well
      await pool.query('COMMIT');

      return resultCliente.insertId; // Return the ID of the inserted client
    } catch (error) {
      // Rollback in case of error
      await pool.query('ROLLBACK');
      throw error;
    }
  },

  updateCliente: async (id, updatedCliente) => {
    try {
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
      return result.affectedRows; // Retorna o número de linhas atualizadas
    } catch (error) {
      throw new Error(`Erro ao atualizar cliente no banco de dados: ${error.message}`);
    }
  },

  deleteCliente: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM Clientes WHERE id_cliente = ?', [id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  getClienteByEmail: async (email) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Clientes WHERE email_cliente = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  updateFotoCliente: async (clienteId, filePath) => {
    try {
      const query = `
        UPDATE Clientes
        SET foto_cliente = ?
        WHERE id_cliente = ?
      `;
      const values = [filePath, clienteId];

      const [result] = await pool.query(query, values);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar foto do cliente no banco de dados: ${error.message}`);
    }
  },
};

module.exports = ClienteModel;
