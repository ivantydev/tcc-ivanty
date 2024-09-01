const EnderecoModel = require('../models/enderecoModel');

const enderecoController = {
  getAllEnderecos: async (req, res) => {
    try {
      const enderecos = await EnderecoModel.getAllEnderecos();
      res.status(200).json(enderecos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEnderecoById: async (req, res) => {
    try {
      const endereco = await EnderecoModel.getEnderecoById(req.params.id);
      if (endereco) {
        res.status(200).json(endereco);
      } else {
        res.status(404).json({ message: 'Endereço não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createEndereco: async (req, res) => {
    try {
      const { cep_endereco, numero_endereco, complemento_endereco, tipo_endereco, id_cliente } = req.body;
      
      if (!cep_endereco || !numero_endereco || !tipo_endereco || !id_cliente) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      // Supondo que id_cliente é parte do endereço a ser criado
      const newEnderecoId = await EnderecoModel.createEndereco({
        cep_endereco,
        numero_endereco,
        complemento_endereco,
        tipo_endereco,
        id_cliente
      });

      res.status(201).json({ id: newEnderecoId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateEndereco: async (req, res) => {
    try {
      const updatedRows = await EnderecoModel.updateEndereco(req.params.id, req.body);
      if (updatedRows > 0) {
        res.status(200).json({ message: 'Endereço atualizado com sucesso' });
      } else {
        res.status(404).json({ message: 'Endereço não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteEndereco: async (req, res) => {
    try {
      const deletedRows = await EnderecoModel.deleteEndereco(req.params.id);
      if (deletedRows > 0) {
        res.status(200).json({ message: 'Endereço excluído com sucesso' });
      } else {
        res.status(404).json({ message: 'Endereço não encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = enderecoController;
