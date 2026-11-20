
const Cart = require('../models/Cart');

const {
  adicionarAoCarrinho,
  removerDoCarrinho
} = require('../services/cartService');

async function adicionarProduto(req, res) {
  try {
    const { produtoId, peso, quantidade } = req.body;

    if (!produtoId || !peso || !Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        mensagem: 'Informe produto, peso e quantidade válida.'
      });
    }

    const carrinho = await adicionarAoCarrinho(
      req.usuario.id,
      produtoId,
      peso,
      quantidade
    );

    return res.status(200).json({
      mensagem: 'Produto adicionado ao carrinho!',
      carrinho
    });

  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

async function consultarCarrinho(req, res) {
  try {
    const carrinho = await Cart.findOne({
      usuario: req.usuario.id
    }).populate('itens.produto');

    if (!carrinho) {
      return res.status(200).json({
        mensagem: 'Carrinho vazio.',
        itens: []
      });
    }

    return res.status(200).json({ carrinho });

  } catch (error) {
    console.error('Erro ao consultar carrinho:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao consultar carrinho.'
    });
  }
}

async function removerProduto(req, res) {
  try {
    const { produtoId, peso } = req.body;

    if (!produtoId || !peso) {
      return res.status(400).json({
        mensagem: 'Informe o produto e a variação.'
      });
    }

    const carrinho = await removerDoCarrinho(
      req.usuario.id,
      produtoId,
      peso
    );

    return res.status(200).json({
      mensagem: 'Produto removido do carrinho!',
      carrinho
    });

  } catch (error) {
    return res.status(400).json({
      mensagem: error.message
    });
  }
}

module.exports = {
  adicionarProduto,
  consultarCarrinho,
  removerProduto
};
