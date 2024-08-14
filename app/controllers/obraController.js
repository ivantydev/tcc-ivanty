const ObraModel = require('../models/obraModel');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './app/public/uploads/obras/'); // Diretório onde as imagens das obras serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const obraController = {
  getAllObras: async (req, res) => {
    try {
      const obras = await ObraModel.getAllObras();
      return res.status(200).json(obras); // Retorne as obras como JSON
    } catch (error) {
      console.error('Erro ao obter todas as obras:', error.message);
      return res.status(500).json({ error: 'Erro ao obter obras' }); // Retorne um erro definido
    }
  },

  getObraById: async (req, res) => {
    try {
      const obra = await ObraModel.getObraById(req.params.id);
      if (obra) {
        return res.status(200).json(obra);
      } else {
        return res.status(404).json({ message: 'Obra não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao obter obra por ID:', error.message);
      return res.status(500).json({ error: error.message });
    }
  },

  createObra: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { titulo_obra, descricao_obra, ano_criacao } = req.body;
      const id_cliente = req.session.cliente.id;

      const newObraId = await ObraModel.createObra({
        titulo_obra,
        descricao_obra,
        ano_criacao,
        id_cliente,
        imagem_obra: null // Inicialmente sem imagem
      });

      return res.status(201).json({ message: 'Obra criada com sucesso', id: newObraId });
    } catch (error) {
      console.error('Erro ao criar obra:', error.message);
      return res.status(500).json({ errors: [{ msg: error.message }] });
    }
  },

  uploadImagem: [
    upload.single('imagem_obra'),
    async (req, res) => {
      try {
        const obraId = req.params.id;
        const imagem_obra = req.file.filename;
        const caminho_imagem = path.join('uploads/obras', imagem_obra);

        const updatedRows = await ObraModel.updateObra(obraId, { imagem_obra: caminho_imagem });

        if (updatedRows > 0) {
          return res.status(200).json({ message: 'Imagem da obra atualizada com sucesso' });
        } else {
          return res.status(404).json({ message: 'Obra não encontrada' });
        }
      } catch (error) {
        console.error('Erro ao atualizar imagem da obra:', error.message);
        return res.status(500).json({ error: error.message });
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
        return res.status(200).json(updatedObra);
      } else {
        return res.status(404).json({ message: 'Obra não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao atualizar obra:', error.message);
      return res.status(500).json({ error: 'Erro ao atualizar obra', message: error.message });
    }
  },

  deleteObra: async (req, res) => {
    try {
      const deletedRows = await ObraModel.deleteObra(req.params.id);
      if (deletedRows > 0) {
        return res.status(200).json({ message: 'Obra excluída com sucesso' });
      } else {
        return res.status(404).json({ message: 'Obra não encontrada' });
      }
    } catch (error) {
      console.error('Erro ao excluir obra:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = obraController;
