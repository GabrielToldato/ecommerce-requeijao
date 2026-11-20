
const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  peso: {
    type: String,
    required: true
  },
  precoUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itens: {
    type: [itemPedidoSchema],
    required: true
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  desconto: {
    type: Number,
    default: 0,
    min: 0
  },
  frete: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  formaPagamento: {
    type: String,
    enum: ['dinheiro', 'cartao'],
    required: true
  },
  status: {
    type: String,
    enum: ['confirmado', 'cancelado'],
    default: 'confirmado'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', pedidoSchema);
