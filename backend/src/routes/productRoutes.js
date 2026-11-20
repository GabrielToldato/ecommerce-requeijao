
const express = require('express');

const {
  listarProdutos
} = require('../controllers/productController');

const router = express.Router();

router.get('/', listarProdutos);

module.exports = router;
