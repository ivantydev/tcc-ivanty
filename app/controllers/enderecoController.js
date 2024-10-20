const EnderecoModel = require('../models/enderecoModel');

const enderecoController = {
  getAllEnderecos: async (req, res) => {
    try {
      const enderecos = await EnderecoModel.getAllEnderecos();
      req.session.notification = {
        message: 'Endereços recuperados com sucesso',
        type: 'success'
      };
      res.redirect('/profile'); // Redireciona após a obtenção
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao recuperar endereços: ' + error.message,
        type: 'error'
      };
      res.redirect('/profile');
    }
  },

  getEnderecoById: async (req, res) => {
    try {
      const endereco = await EnderecoModel.getEnderecoById(req.params.id);
      if (endereco) {
        req.session.notification = {
          message: 'Endereço encontrado com sucesso',
          type: 'success'
        };
        res.redirect('/profile');
      } else {
        req.session.notification = {
          message: 'Endereço não encontrado',
          type: 'warning'
        };
        res.redirect('/profile');
      }
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao buscar endereço: ' + error.message,
        type: 'error'
      };
      res.redirect('/profile');
    }
  },

  createEndereco: async (req, res) => {
    try {
      const { cep_endereco, numero_endereco, complemento_endereco, tipo_endereco } = req.body;

      if (!req.session.cliente || !req.session.cliente.id) {
        req.session.notification = {
          message: 'Cliente não autenticado',
          type: 'error'
        };
        return res.redirect('/profile');
      }

      const id_cliente = req.session.cliente.id;

      if (!cep_endereco || !numero_endereco || !tipo_endereco) {
        req.session.notification = {
          message: 'Todos os campos são obrigatórios',
          type: 'error'
        };
        return res.redirect('/profile');
      }

      const existingEndereco = await EnderecoModel.getEnderecoByClienteId(id_cliente);
      if (existingEndereco) {
        req.session.notification = {
          message: 'O cliente já possui um endereço cadastrado',
          type: 'warning'
        };
        return res.redirect('/profile');
      }

      await EnderecoModel.createEndereco({
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        id_cliente,
      });

      req.session.notification = {
        message: 'Endereço cadastrado com sucesso',
        type: 'success'
      };

      res.redirect('/profile');
    } catch (error) {
      req.session.notification = {
        message: 'Erro no servidor: ' + error.message,
        type: 'error'
      };
      res.redirect('/profile');
    }
  },

  updateEndereco: async (req, res) => {
    try {
      const updatedRows = await EnderecoModel.updateEndereco(req.params.id, req.body);
      if (updatedRows > 0) {
        req.session.notification = {
          message: 'Endereço atualizado com sucesso',
          type: 'success'
        };
        res.redirect('/profile');
      } else {
        req.session.notification = {
          message: 'Endereço não encontrado',
          type: 'warning'
        };
        res.redirect('/profile');
      }
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao atualizar endereço: ' + error.message,
        type: 'error'
      };
      res.redirect('/profile');
    }
  },

  deleteEndereco: async (req, res) => {
    try {
      const deletedRows = await EnderecoModel.deleteEndereco(req.params.id);
      if (deletedRows > 0) {
        req.session.notification = {
          message: 'Endereço excluído com sucesso',
          type: 'success'
        };
        res.redirect('/profile');
      } else {
        req.session.notification = {
          message: 'Endereço não encontrado',
          type: 'warning'
        };
        res.redirect('/profile');
      }
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao excluir endereço: ' + error.message,
        type: 'error'
      };
      res.redirect('/profile');
    }
  },
};

module.exports = enderecoController;
