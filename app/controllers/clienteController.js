const ClienteModel = require('../models/clienteModel');
const pool = require('../../config/pool_conexoes');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const DEFAULT_CONTACT_ID = 1; // ID de contato padrão
const DEFAULT_ADDRESS_ID = 1; // ID de endereço padrão

const clienteController = {
  getAllClientes: async (req, res) => {
    try {
      const clientes = await ClienteModel.getAllClientes();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getClienteById: async (req, res) => {
    try {
      const cliente = await ClienteModel.getClienteById(req.params.id);
      if (cliente) {
        res.status(200).json(cliente);
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCliente: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('cadastro', { errors: errors.array(), formData: req.body });
    }

    try {
      const {
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente,
        datanasc_cliente,
        perfil_cliente = 'user',
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        telefone_cliente
      } = req.body;

      const hashedPassword = await bcrypt.hash(senha_cliente, 10);

      const newClienteId = await ClienteModel.createCliente({
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente: hashedPassword,
        datanasc_cliente,
        perfil_cliente,
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        telefone_cliente
      });

      res.status(201).json({ id: newClienteId });
    } catch (error) {
      res.status(500).render('cadastro', { errors: [{ msg: error.message }], formData: req.body });
    }
  },

  updateCliente: async (req, res) => {
    try {
      const updatedRows = await ClienteModel.updateCliente(req.params.id, req.body);
      if (updatedRows > 0) {
        res.status(200).json({ message: 'Cliente atualizado com sucesso' });
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCliente: async (req, res) => {
    try {
      const deletedRows = await ClienteModel.deleteCliente(req.params.id);
      if (deletedRows > 0) {
        res.status(200).json({ message: 'Cliente excluído com sucesso' });
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  loginCliente: async (req, res) => {
    try {
      const { email_cliente, senha_cliente } = req.body;

      // Check if the client email exists in the database
      const cliente = await ClienteModel.getClienteByEmail(email_cliente);

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      // Compare the provided password with the hashed password stored in the database
      const senhaValida = await bcrypt.compare(senha_cliente, cliente.senha_cliente);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Se as credenciais estiverem corretas, configura a sessão
      req.session.isLoggedIn = true;
      req.session.cliente = {
        id: cliente.id,
        nome: cliente.nome_cliente,
        perfil: cliente.perfil_cliente,
        // Adicione outros campos que deseja armazenar na sessão
      };

      // Redireciona para a home com mensagem de sucesso
      req.session.successMessage = 'Login realizado com sucesso';
      res.redirect('/');

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logoutCliente: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  }
};

module.exports = clienteController;
