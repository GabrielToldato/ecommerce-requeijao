
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
  conectarBanco,
  desconectarBanco
} = require('./config/database');

const carregarDadosIniciais = require('./config/seed');

const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/products', productRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.status(200).json({
    mensagem: 'API E-commerce Requeijão funcionando!',
    status: 'Online',
    versao: '1.0.0'
  });
});

// Inicialização do servidor
async function iniciarServidor() {
  try {
    await conectarBanco();
    await carregarDadosIniciais();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Falha ao iniciar aplicação:', error);
    process.exit(1);
  }
}

// Encerramento seguro
async function encerrarServidor() {
  console.log('\nEncerrando aplicação...');

  await desconectarBanco();

  process.exit(0);
}

process.on('SIGINT', encerrarServidor);
process.on('SIGTERM', encerrarServidor);

iniciarServidor();
