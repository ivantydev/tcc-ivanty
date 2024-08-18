const ObraModel = require('../models/obraModel');
const multer = require('multer');
const path = require('path');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/obras/')); // Diretório onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const obraController = {
  saveObraInSession: (req, res) => {
    const { titulo_obra, descricao_obra, ano_criacao } = req.body;
  
    console.log('Dados Recebidos no Backend:', { titulo_obra, descricao_obra, ano_criacao });
  
    if (!titulo_obra || !descricao_obra || !ano_criacao) {
      return res.status(400).json({ message: 'Dados incompletos. Verifique e tente novamente.' });
    }
  
    req.session.obraData = {
      titulo_obra,
      descricao_obra,
      ano_criacao,
      id_cliente: req.session.cliente.id
    };
  
    console.log('Dados da Obra na Sessão:', req.session.obraData);
  
    return res.redirect('/api/obras/upload-imagem'); // Atualize o caminho aqui
  },
  
  uploadImagem: [
    upload.single('imagem_obra'),
    async (req, res) => {
      try {
        const obraData = req.session.obraData;
  
        console.log('Dados da Obra na Sessão Antes do Upload:', obraData);
  
        if (!obraData) {
          return res.status(400).json({ message: 'Nenhuma obra encontrada na sessão. Por favor, inicie o processo novamente.' });
        }
  
        const { titulo_obra, descricao_obra, ano_criacao, id_cliente } = obraData;
        if (!titulo_obra || !descricao_obra || !ano_criacao || !id_cliente) {
          return res.status(400).json({ message: 'Dados incompletos da obra. Verifique os dados enviados e tente novamente.' });
        }
  
        const imagem_obra = req.file ? req.file.filename : null;
        if (!imagem_obra) {
          return res.status(400).json({ message: 'Imagem não fornecida. Faça o upload de uma imagem e tente novamente.' });
        }
  
        // Atualiza a obraData com o nome do arquivo
        obraData.imagem_obra = imagem_obra;
  
        console.log('Dados da Obra com Imagem:', obraData);
  
        // Salva a obra no banco de dados
        const newObraId = await ObraModel.createObra(obraData);
  
        req.session.obraData = null;
  
        return res.json({ message: 'Obra criada com sucesso', id: newObraId });
      } catch (error) {
        console.error('Erro ao salvar obra com imagem:', error.message);
        return res.status(500).json({ error: error.message });
      }
    }
  ],

  getAllObras: async (req, res) => {
    try {
      const obras = await ObraModel.getAllObras();
      return res.status(200).json(obras);
    } catch (error) {
      console.error('Erro ao obter todas as obras:', error.message);
      return res.status(500).json({ error: 'Erro ao obter obras' });
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
