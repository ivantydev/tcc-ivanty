const db = require('../../config/pool_conexoes'); // Importa o pool de conexões com o banco de dados
const pedidosModel = require('./pedidoModel'); // Importa o modelo de pedidos

const mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN); // Define o token de acesso

const pagamentoModel = {
  // Função para criar uma preferência de pagamento no Mercado Pago
  criarPreferenciaMP: async (pedidoId, carrinho) => {
    try {
      // Calcula o preço total do pedido
      const precoTotal = carrinho.reduce((total, obra) => {
        return total + (obra.preco * obra.quantidade);
      }, 0);

      // Cria uma preferência com as informações do pedido
      const preference = {
        items: carrinho.map((item) => ({
          id: item.id, // ID da obra
          title: item.titulo, // Título da obra
          quantity: item.quantidade, // Quantidade comprada
          unit_price: Number(item.preco), // Preço unitário
          currency_id: 'BRL',
        })),
        back_urls: {
          success: `${process.env.SITE_URL}/pedidos/sucesso`,
          failure: `${process.env.SITE_URL}/pedidos/erro`,
          pending: `${process.env.SITE_URL}/pedidos/pendente`,
        },
        external_reference: pedidoId.toString(),
        auto_return: 'approved', // Redirecionar automaticamente se aprovado
        payment_methods: {
          installments: 1, // Número máximo de parcelas
        },
      };

      // Envia a preferência para a API do Mercado Pago
      const response = await mercadopago.preferences.create(preference);
      return response.body;
      
    } catch (error) {
      console.error('Erro ao criar preferência no Mercado Pago:', error.message);
      throw error;
    }
  },

  // Função para encontrar um pagamento pelo UUID
  findByUUID: async (uuid) => {
    try {
      const [result] = await db.query('SELECT * FROM Pagamentos WHERE id_preferencia_mp = ?', [uuid]);
      return result;
    } catch (error) {
      console.error('Erro ao buscar pagamento pelo UUID:', error.message);
      throw error;
    }
  },

  // Função para inserir um pagamento no banco de dados
  insert: async (data) => {
    try {
      await db.query('INSERT INTO Pagamentos SET ?', [data]);
    } catch (error) {
      console.error('Erro ao inserir pagamento:', error.message);
      throw error;
    }
  },

  // Função para atualizar um pagamento pelo UUID
  updateByUUID: async (data, uuid) => {
    try {
      await db.query('UPDATE Pagamentos SET ? WHERE id_preferencia_mp = ?', [data, uuid]);
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error.message);
      throw error;
    }
  },
};

module.exports = pagamentoModel;
