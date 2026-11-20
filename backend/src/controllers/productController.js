
const Product = require('../models/Product');

async function listarProdutos(req, res) {
  try {
    const produtos = await Product.find({
      ativo: true
    }).select('-__v');

    return res.status(200).json({
      quantidade: produtos.length,
      produtos
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: 'Erro ao listar produtos.',
      erro: error.message
    });
  }
}

module.exports = {
  listarProdutos
};
