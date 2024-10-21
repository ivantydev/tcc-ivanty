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
    const { titulo_obra, descricao_obra, ano_criacao, categorias, preco, quantidade_em_estoque } = req.body;

    if (!titulo_obra || !descricao_obra || !ano_criacao || !categorias || !preco) {
      req.session.notification = {
        message: 'Dados incompletos. Verifique e tente novamente.',
        type: 'error'
      };
      return res.redirect('/api/obras/upload-imagem');
    }

    req.session.obraData = {
      titulo_obra,
      descricao_obra,
      ano_criacao,
      categorias,
      preco,
      quantidade_em_estoque,
      id_cliente: req.session.cliente.id
    };

    req.session.notification = {
      message: 'Dados da obra salvos na sessão. Faça o upload da imagem.',
      type: 'info'
    };

    return res.redirect('/api/obras/upload-imagem');
  },

  uploadImagem: [
    upload.single('imagem_obra'),
    async (req, res) => {
      try {
        const obraData = req.session.obraData;

        if (!obraData) {
          req.session.notification = {
            message: 'Nenhuma obra encontrada na sessão. Por favor, inicie o processo novamente.',
            type: 'error'
          };
          return res.redirect('/profile');
        }

        const imagem_obra = req.file ? req.file.filename : null;
        if (!imagem_obra) {
          req.session.notification = {
            message: 'Imagem não fornecida. Faça o upload de uma imagem e tente novamente.',
            type: 'error'
          };
          return res.redirect('/profile');
        }

        obraData.imagem_obra = imagem_obra;

        await ObraModel.createObra(obraData);

        req.session.obraData = null;

        req.session.notification = {
          message: 'Obra adicionada com sucesso!',
          type: 'success'
        };

        return res.redirect('/profile');
      } catch (error) {
        req.session.notification = {
          message: 'Erro ao salvar obra com imagem.',
          type: 'error'
        };
        console.error('Erro ao salvar obra com imagem:', error.message);
        return res.redirect('/profile');
      }
    }
  ],

  getAllObras: async (req, res) => {
    try {
      const obras = await ObraModel.getAllObras();
      req.session.notification = {
        message: 'Obras obtidas com sucesso!',
        type: 'success'
      };
      return res.render('pages/obras', { obras });
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao obter obras.',
        type: 'error'
      };
      console.error('Erro ao obter todas as obras:', error.message);
      return res.redirect('/profile');
    }
  },

  getObraById: async (req, res) => {
    try {
      const obra = await ObraModel.getObraById(req.params.id);
      if (obra) {
        req.session.notification = {
          message: 'Obra encontrada com sucesso!',
          type: 'success'
        };
        return res.render('pages/obra', { obra });
      } else {
        req.session.notification = {
          message: 'Obra não encontrada.',
          type: 'error'
        };
        return res.redirect('/profile');
      }
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao obter obra.',
        type: 'error'
      };
      console.error('Erro ao obter obra por ID:', error.message);
      return res.redirect('/profile');
    }
  },

  updateObra: async (req, res) => {
    try {
      const obraId = req.params.id;
      const { titulo_obra, descricao_obra, ano_criacao, categorias, preco, quantidade_em_estoque } = req.body;
      console.log(req.body)

      const categoriasPermitidas = ['Pintura', 'Escultura', 'Fotografia', 'Desenho', 'Outros', 'Instalação', 'Grafite'];
      if (!categoriasPermitidas.includes(categorias)) {
        req.session.notification = {
          message: 'Categoria inválida.',
          type: 'error'
        };
        return res.redirect('/profile');
      }

      const updatedRows = await ObraModel.updateObra(obraId, {
        titulo_obra,
        descricao_obra,
        ano_criacao,
        categorias,
        preco,
        quantidade_em_estoque,
      });

      if (updatedRows > 0) {
        req.session.notification = {
          message: 'Obra atualizada com sucesso!',
          type: 'success'
        };
        return res.redirect('/profile');
      } else {
        req.session.notification = {
          message: 'Obra não encontrada.',
          type: 'error'
        };
        return res.redirect('/profile');
      }
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao atualizar obra.',
        type: 'error'
      };
      console.error('Erro ao atualizar obra:', error.message);
      return res.redirect('/profile');
    }
  },

  deleteObra: async (req, res) => {
    try {
      const deletedRows = await ObraModel.deleteObra(req.params.id);
      if (deletedRows > 0) {
        req.session.notification = {
          message: 'Obra excluída com sucesso!',
          type: 'success'
        };
        return res.redirect('/profile');
      } else {
        req.session.notification = {
          message: 'Obra não encontrada.',
          type: 'error'
        };
        return res.redirect('/profile');
      }
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao excluir obra.',
        type: 'error'
      };
      console.error('Erro ao excluir obra:', error.message);
      return res.redirect('/profile');
    }
  },

  listarObras: async (req, res) => {
    try {
      const obras = await ObraModel.getAllObras();
      req.session.notification = {
        message: 'Obras listadas com sucesso!',
        type: 'success'
      };
      return res.render('pages/obras', { obras });
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao listar obras.',
        type: 'error'
      };
      console.error('Erro ao listar obras:', error.message);
      return res.redirect('/profile');
    }
  },

  getObrasByArtista: async (req, res) => {
    try {
      const artistaId = req.session.cliente.id;
      const obras = await ObraModel.getObrasByClienteId(artistaId);
      const cliente = req.session.cliente;

      req.session.notification = {
        message: 'Obras do artista obtidas com sucesso!',
        type: 'success'
      };

      res.render('pages/artistaObras', { obras, artistaId, cliente });
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao obter obras do artista.',
        type: 'error'
      };
      console.error('Erro ao obter obras do artista:', error.message);
      return res.redirect('/profile');
    }
  },

  getObraComArtista: async (req, res) => {
    const obraId = req.params.id;

    try {
      const obra = await ObraModel.getObraWithArtista(obraId);

      if (!obra) {
        req.session.notification = {
          message: 'Obra não encontrada.',
          type: 'error'
        };
        return res.redirect('/profile');
      }

      req.session.notification = {
        message: 'Obra encontrada com sucesso!',
        type: 'success'
      };

      res.render('pages/obra', { obra });
    } catch (error) {
      req.session.notification = {
        message: 'Erro ao obter obra.',
        type: 'error'
      };
      console.error('Erro ao obter obra:', error);
      res.redirect('/profile');
    }
  }
};

module.exports = obraController;
