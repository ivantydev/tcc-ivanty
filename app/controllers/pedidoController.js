const EnderecoModel = require('../models/enderecoModel');
const pedidoModel = require('../models/pedidoModel');
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configurando Mercado Pago com o access token
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// Criando uma nova instância de Preference
const preference = new Preference(client);

const pedidoController = {
  criarPedido: async (req, res) => {
    const carrinho = req.session.carrinho || [];
    const idCliente = req.session.cliente.id;

    if (carrinho.length === 0) {
      return res.status(400).json({ message: 'Carrinho está vazio' });
    }

    try {
      // Verificar se o cliente tem um endereço cadastrado
      const cliente = await EnderecoModel.getEnderecoByClienteId(idCliente);
      console.log('Resultado da consulta de endereço:', cliente);

      if (!cliente) {
        return res.status(400).json({ message: 'Você precisa adicionar um endereço antes de criar um pedido.' });
      }

      // Criação do pedido no banco de dados
      const pedidoId = await pedidoModel.criarPedido(idCliente, 'PENDENTE', null, carrinho);
      req.session.carrinho = [];

      // Gerar preferência de pagamento com Mercado Pago
      const response = await preference.create({
        body: {
          items: carrinho.map(item => ({
            title: item.nome,  // Nome da obra ou produto
            quantity: item.quantidade,
            currency_id: 'BRL',
            unit_price: parseFloat(item.preco)
          })),
          back_urls: {
            success: "http://localhost:3000/api/pagamento/sucesso",
            failure: "http://localhost:3000/api/pagamento/falha",
            pending: "http://localhost:3000/api/pagamento/pendente"
          },
          auto_return: "approved",
          external_reference: pedidoId.toString() // O ID do pedido
        }
      });

      // Logar a resposta do Mercado Pago para verificar erros
      console.log(response);

      // Verificar se o 'init_point' existe na resposta
      if (response && response.init_point) {
        res.json({ init_point: response.init_point });
        const initPoint = response.init_point;

        await pedidoModel.atualizarInitPoint(pedidoId, initPoint);
      } else {
        console.error('init_point não encontrado na resposta:', response);
        res.status(500).json({ error: 'Erro ao obter o link de pagamento.' });
      }
      
    } catch (error) {
      console.error('Erro ao criar pedido:', error.message);
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  },

  exibirPedido: async (req, res) => {
    const pedidoId = req.params.id;

    try {
      const pedido = await pedidoModel.getPedidoById(pedidoId);

      if (!pedido.pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }

      // Calcular o preço total do pedido
      const precoTotal = pedido.obras.reduce((total, obra) => {
        return total + (obra.preco * obra.quantidade);
      }, 0);

      res.render('pages/pedido', { 
        pedido: pedido.pedido, 
        obras: pedido.obras, 
        precoTotal // Passar o preço total para a view
      });
      
    } catch (error) {
      console.error('Erro ao buscar pedido:', error.message);
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  },

  atualizarStatus: async (req, res) => {
    const pedidoId = req.params.id;
    const { statusPedido } = req.body;

    try {
      await pedidoModel.atualizarStatusPedido(pedidoId, statusPedido);
      res.json({ message: 'Status do pedido atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar status' });
    }
  },

  listarPedidos: async (req, res) => {
    const idCliente = req.session.cliente.id;
    const notification = req.session.notification || null;

    try {
      const pedidos = await pedidoModel.getPedidosByClienteId(idCliente);
      res.render('pages/pedidos', { pedidos, notification });
    } catch (error) {
      console.error('Erro ao listar pedidos:', error.message);
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  },

  feedbackPagamento: async (req, res) => {
    const { payment_id, status, external_reference } = req.query;
  
    try {
      // Atualizar o status do pedido no banco de dados
      await pedidoModel.atualizarStatusPagamento(external_reference, status, payment_id);
      
      res.redirect(`/pedidos`);
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error.message);
      res.status(500).json({ message: 'Erro ao processar pagamento' });
    }
  },

  cancelarPedido: async (req, res) => {
    const pedidoId = req.params.id; // ID do pedido a ser cancelado

    try {
        const pedido = await pedidoModel.getPedidoById(pedidoId);

        if (!pedido.pedido) {
            req.session.notification = {
                message: 'Pedido não encontrado',
                type: 'error'
            };
            return res.redirect(req.get('Referer')); // Redireciona para a página anterior
        }

        // Se o pedido já foi pago, ele não pode ser cancelado
        if (pedido.pedido.status_pedido === 'PAGO') {
            req.session.notification = {
                message: 'Pedido já foi pago e não pode ser cancelado.',
                type: 'error'
            };
            return res.redirect(req.get('Referer')); // Redireciona para a página anterior
        }

        // Cancela o pedido
        await pedidoModel.cancelarPedido(pedidoId);

        req.session.notification = {
            message: 'Pedido cancelado com sucesso',
            type: 'success'
        };

        return res.redirect(req.get('Referer')); // Redireciona para a página anterior
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error.message);
        req.session.notification = {
            message: 'Erro ao cancelar pedido',
            type: 'error'
        };
        return res.redirect(req.get('Referer')); // Redireciona para a página anterior
    }
  },

  atualizarEntrega: async (req, res) => {
    const { id_obra, prazo_entrega, informacoes_entrega } = req.body;

    try {
        // Obtém o pedido correspondente à obra
        const pedido = await pedidoModel.getPedidoById(id_obra);
        if (!pedido) {
            return res.status(404).json({ message: 'Pedido não encontrado.' });
        }

        // Atualiza os campos de prazo e informações de entrega
        await pedidoModel.atualizarEntrega(pedido.id_pedido, prazo_entrega, informacoes_entrega);

        res.status(200).json({ message: 'Informações de entrega atualizadas com sucesso.' });
    } catch (error) {
        console.error('Erro ao atualizar informações de entrega:', error.message);
        res.status(500).json({ error: 'Erro ao atualizar as informações de entrega.' });
    }
  }
};

module.exports = pedidoController;
