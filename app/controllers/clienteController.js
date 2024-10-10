const ClienteModel = require('../models/clienteModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const ObraModel = require('../models/obraModel')
const EnderecoModel = require('../models/enderecoModel');
const enderecoController = require('./enderecoController');
const obraController = require('./obraController');
const { default: axios } = require('axios');

const clienteController = {
  getAllClientes: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 24;
      const { clientes, total } = await ClienteModel.getAllClientes(page, limit);
      
      res.json( {
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

        // Usa a função getFotoOuDefault para garantir a foto padrão
        cliente.foto_cliente = clienteController.getFotoOuDefault(cliente.foto_cliente);

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
            perfil_cliente,
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

        // Recupera o endereço do cliente
        const endereco = await EnderecoModel.getEnderecoByClienteId(cliente.id_cliente);
        
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

        if (endereco) {
            req.session.endereco = {
                id: endereco.id_endereco,
                cep: endereco.cep_endereco,
                complemento: endereco.complemento_endereco,
                numero: endereco.numero_endereco,
                tipo: endereco.tipo_endereco,
                id_cliente: endereco.id_cliente
            };
        }

        console.log('Cliente logado:', JSON.stringify(req.session.cliente, null, 2));
        console.log('Endereço do cliente:', JSON.stringify(req.session.endereco, null, 2));

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
  
      // Armazena a mensagem de sucesso na sessão
      req.session.notification = {
        message: 'Foto do cliente atualizada com sucesso',
        type: 'success'
      };
  
      // Redireciona para a página de perfil
      res.redirect('/profile');
    } catch (error) {
      console.error('Erro ao fazer upload da foto do cliente:', error.message);
  
      // Armazena a mensagem de erro na sessão
      req.session.notification = {
        message: 'Erro ao atualizar a foto do cliente: ' + error.message,
        type: 'error'
      };
  
      // Redireciona para a página de perfil
      res.redirect('/profile');
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
        // Busque as obras do artista
        const obras = await ObraModel.getObrasByClienteId(artista.id_cliente);

        // Garante a foto padrão
        artista.foto_cliente = clienteController.getFotoOuDefault(artista.foto_cliente);

        // Armazene os dados no objeto de requisição
        req.artista = artista;
        req.obras = obras;
        next();  // Passa o controle para o próximo middleware (o router que vai renderizar a view)
      } else {
        res.status(404).render('404', { message: 'Artista não encontrado' });
      }
    } catch (error) {
      console.error('Erro ao obter artista:', error.message);
      res.status(500).render('error', { message: error.message });
    }
  },
  
  getArtistsPage: async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const { artistas, totalPages } = await getArtistasPaginados(page);

        res.render('pages/artists', { artistas, currentPage: page, totalPages });
    } catch (error) {
        console.error('Erro ao obter artistas:', error.message);
        res.status(500).send('Erro ao carregar a página de artistas');
    }
  },

  getFotoOuDefault: (fotoCliente) => {
    // Verifica se o cliente tem uma foto; se não, retorna 'default.jpg'
    return fotoCliente ? fotoCliente : 'default.jpg';
  },

  getObrasVendidas: async (req, res) => {
    const { id_cliente } = req.params;  // ID do artista

    try {
      // Obtém as obras vendidas junto com as informações do cliente que comprou
      const obrasVendidas = await ObraModel.getObrasVendidasPorArtista(id_cliente);
      const endereco = await EnderecoModel.getEnderecoById(id_cliente)
      
      // Verifica se existem obras vendidas e mapeia os IDs de cliente e obra
      const obrasComClientes = obrasVendidas.map(obra => ({
        id_obra: obra.id_obra,
        id_cliente: obra.cliente_id,
        endereco: endereco
      }));

      

      // Exibe o array de objetos com IDs no log (opcional)
      console.log('Obras vendidas e seus respectivos clientes:', obrasComClientes);

      // Retorna as obras vendidas junto com os IDs dos clientes que compraram
      res.json(obrasComClientes);
    } catch (error) {
      console.error('Erro ao obter as obras vendidas:', error.message);
      res.status(500).send('Erro ao obter as obras vendidas');
    }
  },

  getObrasVendidasBySession: async (req, res) => {
    const cliente = req.session.cliente;
    if (!cliente) {
        return res.status(401).json({ message: 'Você precisa estar logado para ver as obras vendidas' });
    }

    const id_cliente = cliente.id;

    try {
        const obrasVendidas = await ObraModel.getObrasVendidasPorArtista(id_cliente);
        const endereco = await EnderecoModel.getEnderecoById(id_cliente);

        // Função para obter o endereço detalhado via API ViaCEP
        const obterDetalhesEndereco = async (cep) => {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                return response.data;
            } catch (error) {
                console.error(`Erro ao buscar detalhes do CEP: ${cep}`, error.message);
                return null;  // Retorna nulo se houver um erro
            }
        };

        // Obter detalhes das obras e também buscar informações do endereço via CEP
        const obrasComClientes = await Promise.all(obrasVendidas.map(async (obra) => {
            const detalhesObra = await ObraModel.getObraById(obra.id_obra);
            const detalhesEndereco = await obterDetalhesEndereco(endereco.cep_endereco);  // Busca informações detalhadas pelo CEP

            return {
                id_obra: obra.id_obra,
                detalhes_obra: detalhesObra,  // Adiciona detalhes da obra
                id_cliente: obra.cliente_id,
                endereco: {
                    ...endereco,  // Mantém os dados do banco
                    ...detalhesEndereco  // Sobrescreve com os dados da API ViaCEP
                }
            };
        }));

        console.log('Obras vendidas e seus respectivos clientes:', obrasComClientes);

        // Renderiza a página EJS e envia os dados
        res.render('pages/entregas', { obrasComClientes });
    } catch (error) {
        console.error('Erro ao obter as obras vendidas:', error.message);
        res.status(500).send('Erro ao obter as obras vendidas');
    }
  },
};

module.exports = clienteController;
