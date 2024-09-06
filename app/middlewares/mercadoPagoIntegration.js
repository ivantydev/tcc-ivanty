const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config(); // Carrega as variáveis de ambiente do .env

const client = new mercadopago.MercadoPagoConfig({ accessToken: 'MERCADO_PAGO_ACCESS_TOKEN' });

// Cria uma instância da preferência
const Preference = new mercadopago.Preference(client);

// Middleware para criar e retornar uma preferência do Mercado Pago
const createPreferenceMiddleware = async (req, res, next) => {
  try {
    const preference = new Preference();

    const preferenceResponse = await preference.create({
      items: [
        {
          title: 'Meu produto',
          quantity: 1,
          unit_price: 25,
        }
      ],
    });

    // Adiciona a resposta da preferência à requisição
    req.mercadoPagoPreference = preferenceResponse;
    next();
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};

module.exports = {
  createPreferenceMiddleware
};
