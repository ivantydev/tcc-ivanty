const { body } = require('express-validator');

const validateCadastroCliente = [
  body('nome_cliente').notEmpty().withMessage('Nome é obrigatório.'),
  body('email_cliente').isEmail().withMessage('Email inválido.'),
  body('cpf_cliente').notEmpty().withMessage('CPF é obrigatório.'),
  body('senha_cliente').notEmpty().withMessage('Senha é obrigatória.'),
  body('datanasc_cliente').notEmpty().withMessage('Data de nascimento é obrigatória.'),
  body('telefone_cliente').notEmpty().withMessage('Telefone é obrigatório.'),
  body('tipo_cliente').notEmpty().withMessage('Tipo de cliente é obrigatório.'),
];

module.exports = validateCadastroCliente;
