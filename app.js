const express = require("express");
const app = express();
require('dotenv').config();

// Importar os arquivos de rotas
const clienteRoutes = require('./app/routes/clientesRoutes');
const indexRoutes = require('./app/routes/indexRoutes');

const PORT = process.env.PORT || 3000;

// Middleware para lidar com JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de EJS como motor de visualização
app.set("view engine", "ejs");
app.set("views", "./app/views");

// Servir arquivos estáticos da pasta "public"
app.use(express.static("app/public"));

// Rotas da API
app.use('/api', clienteRoutes);

// Outras rotas
app.use("/", indexRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\nhttp://localhost:${PORT}`);
});
