
const mongoose = require('mongoose');

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ADICIONAR PRODUTO AO CARRINHO
async function adicionarAoCarrinho(usuarioId, produtoId, peso, quantidade) {
  if (!mongoose.Types.ObjectId.isValid(produtoId)) {
    throw new Error('ID do produto inválido.');
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new Error('A quantidade deve ser um número inteiro positivo.');
  }

  if (!peso || typeof peso !== 'string') {
    throw new Error('Informe uma variação válida.');
  }

  const session = await mongoose.startSession();

  let carrinhoAtualizado;

  try {
    await session.withTransaction(async () => {
      const produto = await Product.findById(produtoId).session(session);

      if (!produto) {
        throw new Error('Produto não encontrado.');
      }

      const variacao = produto.variacoes.find(
        item => item.peso === peso
      );

      if (!variacao) {
        throw new Error('Variação de produto não encontrada.');
      }

      let carrinho = await Cart.findOne({
        usuario: usuarioId
      }).session(session);

      if (!carrinho) {
        carrinho = new Cart({
          usuario: usuarioId,
          itens: []
        });
      }

      const itemExistente = carrinho.itens.find(
        item =>
          item.produto.toString() === produtoId &&
          item.peso === peso
      );

      const quantidadeAtual = itemExistente
        ? itemExistente.quantidade
        : 0;

      const novaQuantidade = quantidadeAtual + quantidade;

      if (novaQuantidade > variacao.estoque) {
        throw new Error(
          `Estoque insuficiente. Disponível: ${variacao.estoque} unidade(s).`
        );
      }

      if (itemExistente) {
        itemExistente.quantidade = novaQuantidade;
      } else {
        carrinho.itens.push({
          produto: produtoId,
          peso,
          quantidade
        });
      }

      await carrinho.save({ session });

      carrinhoAtualizado = carrinho;
    });

    return carrinhoAtualizado;

  } finally {
    await session.endSession();
  }
}

// REMOVER PRODUTO DO CARRINHO
async function removerDoCarrinho(usuarioId, produtoId, peso) {
  if (!mongoose.Types.ObjectId.isValid(produtoId)) {
    throw new Error('ID do produto inválido.');
  }

  const carrinho = await Cart.findOne({
    usuario: usuarioId
  });

  if (!carrinho) {
    throw new Error('Carrinho não encontrado.');
  }

  const quantidadeInicial = carrinho.itens.length;

  carrinho.itens = carrinho.itens.filter(item =>
    !(
      item.produto.toString() === produtoId &&
      item.peso === peso
    )
  );

  if (carrinho.itens.length === quantidadeInicial) {
    throw new Error('Item não encontrado no carrinho.');
  }

  await carrinho.save();

  return carrinho;
}

// EXPORTAÇÕES
module.exports = {
  adicionarAoCarrinho,
  removerDoCarrinho
};

