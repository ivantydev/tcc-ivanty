const express = require("express");
const session = require('express-session');
const app = express();
require('dotenv').config();

const clienteRoutes = require('./app/routes/clientesRoutes');
const obrasRoutes = require('./app/routes/obrasRoutes');
const indexRoutes = require('./app/routes/indexRoutes');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.static("app/public"));

// Configuração da sessão
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use secure: true em produção com HTTPS
}));

// Middleware para definir variáveis globais
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});

app.use('/api', clienteRoutes);
app.use('/api', obrasRoutes);
app.use("/", indexRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\nhttp://localhost:${PORT}`);
});
