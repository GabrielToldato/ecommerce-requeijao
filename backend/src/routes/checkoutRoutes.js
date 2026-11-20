
const express = require('express');

const autenticarUsuario = require('../middlewares/authMiddleware');

const {
  concluirCompra
} = require('../controllers/checkoutController');

const router = express.Router();

// Proteção da rota com JWT
router.use(autenticarUsuario);

// Finalizar compra
router.post('/finalizar', concluirCompra);

module.exports = router;
