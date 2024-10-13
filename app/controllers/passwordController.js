const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Para envio de emails
const ClienteModel = require('../models/clienteModel');
const PasswordResetModel = require('../models/passwordResetModel');
require('dotenv').config(); // Carrega as variáveis de ambiente
const bcrypt = require('bcrypt');
const saltRounds = 10;

const transporter = nodemailer.createTransport({
    service: 'gmail', // Pode usar 'gmail' como serviço
    auth: {
        user: process.env.EMAIL_USER, // Seu email
        pass: process.env.EMAIL_PASS, // Senha ou senha de aplicativo
    },
});

// Envio de um email de teste
transporter.sendMail({
    from: process.env.EMAIL_USER, // Seu email
    to: 'destinatario@dominio.com', // Email do destinatário
    subject: 'Teste de Email com Nodemailer',
    text: 'Este é um teste de envio de email usando Nodemailer com Gmail.',
}, (error, info) => {
    if (error) {
        return console.log('Erro ao enviar email:', error);
    }
    console.log('Email enviado: %s', info.messageId);
});

const passwordController = {
    // Exibe o formulário de solicitação de recuperação de senha
    showRequestForm: (req, res) => {
        res.render('pages/requestPasswordReset');
    },

    // Processa o pedido de recuperação de senha
    handleRequest: async (req, res) => {
        const { email } = req.body;

        // Verifica se o usuário existe
        const user = await ClienteModel.getClienteByEmail(email);
        if (!user) {
            return res.render('pages/requestPasswordReset', { message: 'E-mail não encontrado!' });
        }

        // Gera um token de recuperação
        const token = crypto.randomBytes(32).toString('hex');

        // Salva o token no banco de dados
        await PasswordResetModel.createToken(email, token);

        // Envia o email de recuperação
        const resetLink = `http://${req.headers.host}/password/password-reset/${token}`;
        await transporter.sendMail({
            from: 'seuemail@gmail.com', // Substitua pelo seu email
            to: email,
            subject: 'Recuperação de Senha',
            text: `Você solicitou a recuperação de senha. Clique no link a seguir para redefinir sua senha: ${resetLink}`,
        });

        res.render('pages/requestPasswordReset', { message: 'Instruções de recuperação enviadas para seu e-mail!' });
    },

    // Exibe o formulário para redefinir a senha
    showResetForm: async (req, res) => {
        const { token } = req.params;

        // Verifica se o token é válido
        const tokenData = await PasswordResetModel.findByToken(token);
        if (!tokenData) {
            return res.status(400).send('Token inválido ou expirado.');
        }

        res.render('pages/resetPassword', { token });
    },

    // Processa a redefinição de senha
    handleReset: async (req, res) => {
        const { token } = req.params;
        const { password, confirm_password } = req.body;
    
        // Valida se as senhas coincidem
        if (password !== confirm_password) {
            return res.render('pages/resetPassword', { token, message: 'As senhas não coincidem!' });
        }
    
        // Verifica se o token é válido
        const tokenData = await PasswordResetModel.findByToken(token);
        if (!tokenData) {
            return res.status(400).send('Token inválido ou expirado.');
        }
    
        // Atualiza a senha do usuário sem criptografá-la aqui
        await ClienteModel.updatePassword(tokenData.email, password);
    
        // Deleta o token usado
        await PasswordResetModel.deleteToken(tokenData.email);
    
        // Renderiza a página com uma mensagem de sucesso e o token
        res.render('pages/resetPassword', { token, message: 'Senha alterada com sucesso!' });
    }    
}    

module.exports = passwordController;
