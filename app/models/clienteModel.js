const pool = require(`./../../config/pool_conexoes`);   
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

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
    const { nome_cliente, email_cliente, cpf_cliente, senha_cliente, datanasc_cliente, perfil_cliente, cep_endereco, numero_endereco, complemento_endereco, tipo_endereco, telefone_cliente } = cliente;

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
        telefone_cliente
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

  updateCliente: async (id, cliente) => {
    const { nome_cliente, email_cliente, cpf_cliente, senha_cliente, datanasc_cliente, perfil_cliente, telefone_cliente } = cliente;
    try {
      const [result] = await pool.query('UPDATE Clientes SET ? WHERE id_cliente = ?', [{
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente,
        datanasc_cliente,
        perfil_cliente,
        telefone_cliente
      }, id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
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
    const [rows] = await pool.query('SELECT * FROM Clientes WHERE email_cliente = ?', [email]);
    return rows[0];
  }, 
  
};

module.exports = ClienteModel;
