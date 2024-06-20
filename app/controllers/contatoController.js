const ContatoModel = require('../models/contatoModel');

const contatoController = {
  getAllContatos: async (req, res) => {
    try {
      const contatos = await ContatoModel.getAllContatos();
      res.status(200).json(contatos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getContatoById: async (req, res) => {
    try {
      const contato = await ContatoModel.getContatoById(req.params.id);
      if (contato) {
        res.status(200).json(contato);
      } else {
        res.status(404).json({ message: 'Contato não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createContato: async (req, res) => {
    try {
      const { celular_contato, email_contato, tipo_contato } = req.body;
      if (!celular_contato || !email_contato || !tipo_contato) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const newContatoId = await ContatoModel.createContato({
        celular_contato,
        email_contato,
        tipo_contato
      });

      res.status(201).json({ id: newContatoId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateContato: async (req, res) => {
    try {
      const updatedRows = await ContatoModel.updateContato(req.params.id, req.body);
      if (updatedRows > 0) {
        res.status(200).json({ message: 'Contato atualizado com sucesso' });
      } else {
        res.status(404).json({ message: 'Contato não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteContato: async (req, res) => {
    try {
      const deletedRows = await ContatoModel.deleteContato(req.params.id);
      if (deletedRows > 0) {
        res.status(200).json({ message: 'Contato excluído com sucesso' });
      } else {
        res.status(404).json({ message: 'Contato não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = contatoController;
