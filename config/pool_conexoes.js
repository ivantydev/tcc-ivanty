const mysql = require('mysql2');
console.log('Configurando o pool de conexões'); // Adicione um log para depuração
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

module.exports = pool.promise();
