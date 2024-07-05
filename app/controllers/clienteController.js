const ClienteModel = require('../models/clienteModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Diretório onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const clienteController = {
  getAllClientes: async (req, res) => {
    try {
      const clientes = await ClienteModel.getAllClientes();
      res.status(200).json(clientes);
    } catch (error) {
      console.error('Erro ao obter todos os clientes:', error.message);
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
      console.error('Erro ao obter cliente por ID:', error.message);
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
        datanasc_cliente,
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        telefone_cliente,
        tipo_cliente
      } = req.body;

      console.log('Dados recebidos para criação de cliente:', req.body);

      const newClienteId = await ClienteModel.createCliente({
        nome_cliente,
        email_cliente,
        cpf_cliente,
        senha_cliente,
        datanasc_cliente,
        perfil_cliente,
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        telefone_cliente,
        tipo_cliente
      });

      res.status(201).redirect('/login');
    } catch (error) {
      console.error('Erro ao criar cliente:', error.message);
      res.status(500).json({ errors: [{ msg: error.message }], formData: req.body });
    }
  },

  updateCliente: async (req, res) => {
    try {
      const clienteId = req.params.id;
      const updatedData = req.body;

      // Remova campos que não devem ser atualizados diretamente no perfil
      delete updatedData.email_cliente;
      delete updatedData.cpf_cliente;
      delete updatedData.senha_cliente;
      delete updatedData.tipo_cliente;

      // Verificar se há senha para atualizar
      if (updatedData.senha_cliente) {
        updatedData.senha_cliente = await bcrypt.hash(updatedData.senha_cliente, saltRounds);
      }

      const updatedRows = await ClienteModel.updateCliente(clienteId, updatedData);
      
      if (updatedRows > 0) {
        const updatedCliente = await ClienteModel.getClienteById(clienteId);
        res.status(200).json(updatedCliente);
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar cliente', message: error.message });
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
      console.error('Erro ao excluir cliente:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  loginCliente: async (req, res) => {
    try {
      const { email_cliente, senha_cliente } = req.body;
      const cliente = await ClienteModel.getClienteByEmail(email_cliente);

      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha_cliente, cliente.senha_cliente);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      req.session.isLoggedIn = true;
      req.session.cliente = {
        id: cliente.id_cliente,
        nome: cliente.nome_cliente,
        perfil: cliente.perfil_cliente,
        datanasc: cliente.datanasc_cliente,
        telefone: cliente.telefone_cliente,
        foto: cliente.foto_cliente,
      };

      req.session.successMessage = 'Login realizado com sucesso';
      res.redirect('/');
    } catch (error) {
      console.error('Erro ao realizar login:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  logoutCliente: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Erro ao realizar logout:', err.message);
        return res.status(500).json({ message: 'Erro ao fazer logout' });
      }
      res.status(200).json({ message: 'Logout realizado com sucesso' });
    });
  },

  updateClienteProfile: async (req, res) => {
    try {
      const clienteId = req.params.id;
      const updatedData = req.body;

      // Remova campos que não devem ser atualizados diretamente no perfil
      delete updatedData.email_cliente;
      delete updatedData.cpf_cliente;
      delete updatedData.senha_cliente;
      delete updatedData.tipo_cliente;

      // Verificar se há senha para atualizar
      if (updatedData.senha_cliente) {
        updatedData.senha_cliente = await bcrypt.hash(updatedData.senha_cliente, saltRounds);
      }

      const updatedRows = await ClienteModel.updateCliente(clienteId, updatedData);
      
      if (updatedRows > 0) {
        const updatedCliente = await ClienteModel.getClienteById(clienteId);
        res.status(200).json(updatedCliente);
      } else {
        res.status(404).json({ message: 'Cliente não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar perfil', message: error.message });
    }
  },

  uploadFoto: async (req, res) => {
    try {
        const clienteId = req.session.cliente.id; // Supondo que você tenha um cliente logado
        const filePath = req.file.path;

        // Atualize o campo 'foto_cliente' no banco de dados para o cliente com o ID clienteId
        await ClienteModel.updateFotoCliente(clienteId, filePath);

        res.status(200).json({ message: 'Foto do cliente atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao fazer upload da foto do cliente:', error.message);
        res.status(500).json({ error: error.message });
    }
},

  // Função opcional para deletar a foto do cliente
  deleteFoto: async (req, res) => {
    try {
      const clienteId = req.session.cliente.id; // Supondo que você tenha um cliente logado

      // Exclua a foto do cliente no banco de dados
      await ClienteModel.deleteFotoCliente(clienteId);

      res.status(200).json({ message: 'Foto do cliente excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir a foto do cliente:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = clienteController;
