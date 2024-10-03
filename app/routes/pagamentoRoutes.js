require('dotenv').config(); // Carregar variáveis do .env
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago'); // Importar MercadoPagoConfig e Preference
const pedidoModel = require('../models/pedidoModel');

// Configurar as credenciais de acesso do Mercado Pago
const mp = new MercadoPagoConfig({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Usar o access token do .env
});

// Rota para criar a preferência de pagamento
router.get('/checkout/:idPedido', async (req, res) => {
  const { idPedido } = req.params;

  try {
    // Obter informações do pedido
    const pedido = await pedidoModel.getPedidoById(idPedido);
    
    // Verificar se o pedido foi encontrado
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const obras = pedido.obras;

    // Criar itens de pagamento com base nas obras do pedido
    const items = obras.map((obra) => ({
      title: obra.titulo_obra,
      unit_price: parseFloat(obra.preco), // Certifique-se de que é um número
      quantity: obra.quantidade,
    }));

    // Criar a preferência de pagamento no Mercado Pago
    const preference = new Preference({
      items,
      back_urls: {
        success: `http://localhost:3000/pagamento/sucesso/${idPedido}`,
        failure: `http://localhost:3000/pagamento/erro/${idPedido}`,
        pending: `http://localhost:3000/pagamento/pendente/${idPedido}`,
      },
      auto_return: 'approved',
    });

    // Criar a preferência de pagamento no Mercado Pago
    const response = await mp.preferences.create(preference);

    // Verifique se a criação da preferência foi bem-sucedida
    if (response.body.id) {
      // Redirecionar para o URL de pagamento do Mercado Pago
      res.render('pagamento', {
        idPedido,
        preferenceId: response.body.id, // Enviar o preferenceId para o front-end
      });
    } else {
      res.status(500).json({ error: 'Erro ao criar a preferência de pagamento' });
    }
  } catch (error) {
    // Lidar com erros e enviar uma resposta apropriada
    res.status(500).json({ error: 'Erro ao criar a preferência de pagamento', details: error.message });
  }
});

module.exports = router;
