
const express = require('express');

const autenticarUsuario = require('../middlewares/authMiddleware');

const {
  adicionarProduto,
  consultarCarrinho,
  removerProduto
} = require('../controllers/cartController');

const router = express.Router();

router.use(autenticarUsuario);

router.post('/add', adicionarProduto);

router.get('/', consultarCarrinho);

router.delete('/remove', removerProduto);

module.exports = router;


