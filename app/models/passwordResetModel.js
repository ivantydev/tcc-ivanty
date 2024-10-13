const pool = require('../../config/pool_conexoes');

const PasswordResetModel = {
    createToken: async (email, token) => {
        const query = 'INSERT INTO password_resets (email, token) VALUES (?, ?)';
        try {
            await pool.query(query, [email, token]);
        } catch (error) {
            console.error('Erro ao criar token de recuperação de senha:', error);
            throw error;
        }
    },

    findByToken: async (token) => {
        const query = 'SELECT * FROM password_resets WHERE token = ? AND created_at >= NOW() - INTERVAL 1 HOUR';
        try {
            const [rows] = await pool.query(query, [token]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao encontrar token de recuperação de senha:', error);
            throw error;
        }
    },    

    deleteToken: async (email) => {
        const query = 'DELETE FROM password_resets WHERE email = ?';
        try {
            await pool.query(query, [email]);
        } catch (error) {
            console.error('Erro ao deletar token de recuperação de senha:', error);
            throw error;
        }
    }
};

module.exports = PasswordResetModel;
