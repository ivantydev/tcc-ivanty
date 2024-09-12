const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do .env
dotenv.config();

// Configura o Mercado Pago com o token de acesso do arquivo .env
mercadopago.configurations = {
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
};

// Middleware para criar e retornar uma preferência do Mercado Pago
const createPreferenceMiddleware = async (req, res, next) => {
  try {
    // Criação da preferência com os dados necessários
    const preferenceData = {
      items: [
        {
          title: 'Meu produto',
          quantity: 1,
          unit_price: 25,
        },
      ],
    };

    // Cria a preferência usando o método correto do SDK do Mercado Pago
    const preferenceResponse = await mercadopago.preferences.create(preferenceData);

    // Adiciona a resposta da preferência à requisição
    req.mercadoPagoPreference = preferenceResponse.body;
    next();
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};

// Exportação correta do middleware como uma função
module.exports = createPreferenceMiddleware;