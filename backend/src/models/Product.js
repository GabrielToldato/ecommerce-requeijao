
const mongoose = require('mongoose');

const variacaoSchema = new mongoose.Schema({
  peso: {
    type: String,
    required: true
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  estoque: {
    type: Number,
    required: true,
    min: 0
  }
});

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  variacoes: {
    type: [variacaoSchema],
    required: true
  },
  ativo: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', produtoSchema);
