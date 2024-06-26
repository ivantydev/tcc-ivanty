const ClienteModel = require('../models/clienteModel');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), formData: req.body });
      }

      const {
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente,
        perfil_cliente = 'user',
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        telefone_cliente
      } = req.body;

      console.log('Dados recebidos para criação de cliente:', req.body); // Adiciona log dos dados recebidos

      // Hash da senha usando bcrypt
      const hashedPassword = await bcrypt.hash(senha_cliente, 8);

      // Criação do novo cliente no banco de dados
      const newClienteId = await ClienteModel.createCliente({
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente: hashedPassword,
        perfil_cliente,
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        telefone_cliente
      });

      res.status(201).redirect('/login'); // Redireciona para a página de login após o cadastro
    } catch (error) {
      console.error('Erro ao criar cliente:', error.message);
      res.status(500).json({ errors: [{ msg: error.message }], formData: req.body });
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

      // Verifica se o e-mail do cliente existe no banco de dados
      const cliente = await ClienteModel.getClienteByEmail(email_cliente);

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

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
