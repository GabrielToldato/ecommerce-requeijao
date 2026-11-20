
const mongoose = require('mongoose');

const itemCarrinhoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  peso: {
    type: String,
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  }
});

const carrinhoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  itens: {
    type: [itemCarrinhoSchema],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', carrinhoSchema);
