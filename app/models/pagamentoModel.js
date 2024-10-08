const db = require('../../config/pool_conexoes');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const pedidoModel = require('./pedidoModel');
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN })
const preference = new Preference(client)

const PagamentoModel = {
    createPreferenceMP: async (id_pedido, uuid) => {
        try {
            const {pedido} = await pedidoModel.getPedidoById(id_pedido)
            let preco_total = pedido.preco_total
            console.log(preco_total)

            const response = await preference.create({
                body: {
                    items: [
                        {
                            id: uuid, // UUID
                            title: 'Ivanty Pedido',
                            quantity: 1,
                            currency_id: 'BRL',
                            unit_price: Number(preco_total),
                        }
                    ],
                    back_urls: {
                        "success": `${process.env.SITE_URL}/cliente/feedback-pagamento`,
                        "failure": `${process.env.SITE_URL}/cliente/feedback-pagamento`,
                        "pending": `${process.env.SITE_URL}/cliente/feedback-pagamento`
                    },
                    auto_return: "approved",
                    external_reference: uuid,
                    payment_methods: {
                        excluded_payment_methods: [
                            { id: "bolbradesco" },
                            { id: "pec" }
                        ],
                        excluded_payment_types: [
                            { id: "debit_card" }
                        ],
                        installments: 10
                    }
                },
            })

            console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }
    },
}

module.exports = PagamentoModel;
