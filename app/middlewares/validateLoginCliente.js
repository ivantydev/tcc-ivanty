const { body } = require('express-validator');

const validateLoginCliente = [
  body('email_cliente')
    .isEmail().withMessage('Email inválido'),
  body('senha_cliente')
    .notEmpty().withMessage('Senha é obrigatória')
];

module.exports = validateLoginCliente;
