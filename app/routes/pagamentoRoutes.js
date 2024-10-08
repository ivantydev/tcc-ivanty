const express = require('express');
const router = express.Router();
const PagamentoModel = require('./../models/pagamentoModel');

router.get('/criar-pedido/:id_pedido', async (req, res) => {
  try {
    const { id_pedido } = req.params;
    
    // Chama a função e aguarda o retorno
    const pagamento = await PagamentoModel.createPreferenceMP(id_pedido);
    
    // Extrai o valor do init_point do objeto de pagamento retornado
    const initPoint = pagamento.init_point;
    
    // Faz o redirecionamento para o init_point
    res.redirect(initPoint);
    
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    res.status(500).send('Erro ao processar o pedido.');
  }
});

module.exports = router;
