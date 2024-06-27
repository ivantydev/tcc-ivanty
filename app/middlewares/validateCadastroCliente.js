const { body } = require('express-validator');
const pool = require('../../config/pool_conexoes');

const validateCadastroCliente = [
  body('nome_cliente')
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email_cliente')
    .isEmail().withMessage('Email inválido')
    .custom(async (email) => {
      const [rows] = await pool.query('SELECT id_cliente FROM Clientes WHERE email_cliente = ?', [email]);
      if (rows.length > 0) {
        throw new Error('Email já está em uso');
      }
      return true;
    }),
    
  body('cpf_cliente')
    .notEmpty().withMessage('CPF é obrigatório')
    .isLength({ min: 11, max: 11 }).withMessage('CPF deve ter 11 caracteres'),

  body('senha_cliente')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('datanasc_cliente')
    .notEmpty().withMessage('Data de nascimento é obrigatória')
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Data de nascimento inválida'),
  body('cep_endereco')
    .notEmpty().withMessage('CEP é obrigatório'),
  body('numero_endereco')
    .notEmpty().withMessage('Número do endereço é obrigatório'),
  body('complemento_endereco')
    .optional(),
  body('tipo_endereco')
    .notEmpty().withMessage('Tipo de endereço é obrigatório'),
  body('telefone_cliente')
    .notEmpty().withMessage('Telefone é obrigatório')
    .isLength({ min: 10, max: 11 }).withMessage('Telefone deve ter entre 10 e 11 dígitos')
];

module.exports = validateCadastroCliente;
