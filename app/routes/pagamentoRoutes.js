require('dotenv').config(); // Carregar variáveis do .env
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago'); // Importar MercadoPagoConfig e Preference
const pedidoModel = require('../models/pedidoModel');

// Configurar o Mercado Pago
const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Rota para criar um pedido e uma preferência de pagamento
router.post('/criar-pedido', async (req, res) => {
  const { idCliente, statusPagamento, idPagamento, carrinho } = req.body;

  try {
    // Criar o pedido no banco de dados
    const pedidoId = await pedidoModel.criarPedido(idCliente, statusPagamento, idPagamento, carrinho);

    // Calcular o preço total do carrinho
    const precoTotal = carrinho.reduce((total, item) => total + (parseFloat(item.preco) * item.quantidade), 0);

    // Criar a preferência de pagamento
    const preference = {
      items: carrinho.map(item => ({
        title: item.titulo, // Título do item
        quantity: item.quantidade, // Quantidade do item
        unit_price: parseFloat(item.preco), // Preço unitário
      })),
      back_urls: {
        success: 'http://www.your-site/success',
        failure: 'http://www.your-site/failure',
        pending: 'http://www.your-site/pending'
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [{
          id: 'ticket'
        }],
        installments: 6
      }
    };

    const preferenceResponse = await mp.preferences.create(preference);
    
    // Retornar a preferência de pagamento
    res.status(201).json({
      pedidoId,
      preferenceId: preferenceResponse.body.id,
      init_point: preferenceResponse.body.init_point // URL para iniciar o pagamento
    });
  } catch (error) {
    console.error('Error creating order or preference:', error.message);
    res.status(500).json({ error: 'Erro ao criar pedido ou preferência de pagamento.' });
  }
});

module.exports = router;
