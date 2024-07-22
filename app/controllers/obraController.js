const ObraModel = require('../models/obraModel');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/obras/'); // Diretório onde as imagens das obras serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const obraController = {
  renderMainPage: async (req, res) => {
    try {
      const obras = await ObraModel.getAllObras();
      res.render('pages/index', { obras });
    } catch (error) {
      console.error('Erro ao obter todas as obras:', error.message);
      res.status(500).send('Erro ao obter obras');
    }
  },

  getAllObras: async () => {
    try {
      const obras = await ObraModel.getAllObras();
      return obras;
    } catch (error) {
      console.error('Erro ao obter todas as obras:', error.message);
      throw new Error(error.message);
    }
  },

  getObraById: async (req, res) => {
    try {
      const obra = await ObraModel.getObraById(req.params.id);
      if (obra) {
        res.status(200).json(obra);
      } else {
        res.status(404).json({ message: 'Obra não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao obter obra por ID:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  createObra: [
    upload.single('imagem_obra'),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array(), formData: req.body });
        }

        const {
          titulo_obra,
          descricao_obra,
          ano_criacao
        } = req.body;

        console.log('Dados recebidos para criação de obra:', req.body);
        console.log('Arquivo recebido:', req.file);

        const imagem_obra = req.file.filename;

        // Obtendo id_cliente da sessão
        const id_cliente = req.session.cliente.id;

        const newObraId = await ObraModel.createObra({
          titulo_obra,
          descricao_obra,
          ano_criacao,
          id_cliente,
          imagem_obra
        });

        res.status(201).json({ message: 'Obra criada com sucesso', id: newObraId });
      } catch (error) {
        console.error('Erro ao criar obra:', error.message);
        res.status(500).json({ errors: [{ msg: error.message }], formData: req.body });
      }
    }
  ],

  updateObra: async (req, res) => {
    try {
      const obraId = req.params.id;
      const updatedData = req.body;

      const updatedRows = await ObraModel.updateObra(obraId, updatedData);

      if (updatedRows > 0) {
        const updatedObra = await ObraModel.getObraById(obraId);
        res.status(200).json(updatedObra);
      } else {
        res.status(404).json({ message: 'Obra não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao atualizar obra:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar obra', message: error.message });
    }
  },

  deleteObra: async (req, res) => {
    try {
      const deletedRows = await ObraModel.deleteObra(req.params.id);
      if (deletedRows > 0) {
        res.status(200).json({ message: 'Obra excluída com sucesso' });
      } else {
        res.status(404).json({ message: 'Obra não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao excluir obra:', error.message);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = obraController;
