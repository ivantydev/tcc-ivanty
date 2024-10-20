const express = require("express");
const session = require('express-session');
const app = express();
require('dotenv').config();

const clienteRoutes = require('./app/routes/clientesRoutes');
const obrasRoutes = require('./app/routes/obrasRoutes');
const indexRoutes = require('./app/routes/indexRoutes');
const pedidoRoutes = require('./app/routes/pedidoRoutes');
const carrinhoRoutes = require('./app/routes/carrinhoRoutes');
const enderecoRoutes = require('./app/routes/enderecosRoutes');
const artistaRoutes = require('./app/routes/artistaRoutes');
const passwordRoutes = require('./app/routes/passwordRoutes');

const PORT = process.env.PORT || 3000;

// Middleware para processar JSON e dados de formulários URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.static("app/public"));

// Configuração da sessão
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true } // Use secure: true se estiver usando HTTPS
}));

// Middleware para definir variáveis globais
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

// Definição das rotas
app.use('/api', clienteRoutes);
app.use('/api', obrasRoutes);
app.use('/api', enderecoRoutes);
app.use("/", artistaRoutes);
app.use("/", indexRoutes);
app.use("/api", carrinhoRoutes);
app.use("/api", pedidoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/password', passwordRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.render('index');
});

// Middleware para logar a sessão
app.use((req, res, next) => {
  console.log('Sessão Atual:', req.session);
  next();
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\nhttp://localhost:${PORT}/`);
});
