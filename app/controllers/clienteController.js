const ClienteModel = require('../models/clienteModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');

const clienteController = {
  getAllClientes: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const { clientes, total } = await ClienteModel.getAllClientes(page, limit);
      
      res.render('index', {
        clientes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('Erro ao obter todos os clientes:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getClienteById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id]);
      
      if (rows.length > 0) {
        const cliente = rows[0];
        const [endereco] = await pool.query('SELECT * FROM Enderecos WHERE id_endereco = ?', [cliente.Enderecos_id_endereco]);
        cliente.endereco = endereco[0];
        return cliente;
      }

      return null;
    } catch (error) {
      throw error;
    }
  },

  createCliente: async (req, res) => {
    try {
        const { nome_cliente, email_cliente, cpf_cliente, senha_cliente, datanasc_cliente, perfil_cliente = 'default', telefone_cliente, tipo_cliente } = req.body;

        const newClienteId = await ClienteModel.createCliente({
            nome_cliente,
            email_cliente,
            cpf_cliente,
            senha_cliente,
            datanasc_cliente,
            perfil_cliente, // Garante que não seja nulo
            telefone_cliente,
            tipo_cliente
        });

        res.status(201).redirect(`/login`); // Redireciona para a página de login
    } catch (error) {
        console.error('Erro ao criar cliente:', error.message);
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
  },


  updateCliente: async (req, res) => {
    try {
      const clienteId = req.params.id;
      const updatedData = req.body;

      delete updatedData.email_cliente;
      delete updatedData.cpf_cliente;
      delete updatedData.senha_cliente;
      delete updatedData.tipo_cliente;

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
        tipo_cliente: cliente.tipo_cliente,
        id_endereco: cliente.Enderecos_id_endereco,
      };
  
      console.log('Cliente logado:', JSON.stringify(req.session.cliente, null, 2));
  
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

      delete updatedData.email_cliente;
      delete updatedData.cpf_cliente;
      delete updatedData.senha_cliente;
      delete updatedData.tipo_cliente;
      delete updatedData.datanasc_cliente;

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
        const clienteId = req.session.cliente.id;
        const fileName = req.file.filename;  // Salva apenas o nome do arquivo

        // Atualiza o nome do arquivo no banco de dados
        await ClienteModel.updateFotoCliente(clienteId, fileName);

        // Atualiza a sessão com o novo nome da foto
        req.session.cliente.foto = fileName;

        res.status(200).json({ message: 'Foto do cliente atualizada com sucesso', fileName });
    } catch (error) {
        console.error('Erro ao fazer upload da foto do cliente:', error.message);
        res.status(500).json({ error: error.message });
    }
  },

  deleteFoto: async (req, res) => {
    try {
      const clienteId = req.session.cliente.id;

      await ClienteModel.deleteFotoCliente(clienteId);

      res.status(200).json({ message: 'Foto do cliente excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir a foto do cliente:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getArtistas: async (req, res) => {
    try {
      const artistas = await ClienteModel.getArtistas();
      res.render('index', { artistas });
    } catch (error) {
      console.error('Erro ao obter artistas:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  getArtistas: async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 24;
        const { artistas, total } = await ClienteModel.getArtistas(page, limit);
        
        res.json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            artistas
        });
    } catch (error) {
        console.error('Erro ao obter artistas:', error.message);
        res.status(500).json({ error: error.message });
    }
  },

  getArtistaByUsername: async (req, res, next) => {
    try {
        const username = req.params.username;
        const artista = await ClienteModel.getArtistaByUsername(username);

        if (artista) {
            req.artista = artista;  // Armazena os dados no objeto de requisição
            next();  // Passa o controle para o próximo middleware (o router que vai renderizar a view)
        } else {
            res.status(404).render('404', { message: 'Artista não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter artista:', error.message);
        res.status(500).render('error', { error: error.message });
    }
  },

};

module.exports = clienteController;
