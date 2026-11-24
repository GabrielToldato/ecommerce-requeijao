
const mongoose = require('mongoose');

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const { calcularFrete } = require('./freteService');

const LIMITE_VIP = 300;

function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

async function finalizarCompra(usuarioId, formaPagamento, cepDestino) {
  if (!['dinheiro', 'cartao'].includes(formaPagamento)) {
    throw new Error('Forma de pagamento inválida.');
  }

  const session = await mongoose.startSession();

  let resultado;

  try {
    await session.withTransaction(async () => {

      const usuario = await User.findById(usuarioId).session(session);

      if (!usuario) {
        throw new Error('Usuário não encontrado.');
      }

      const carrinho = await Cart.findOne({
        usuario: usuarioId
      }).session(session);

      if (!carrinho || carrinho.itens.length === 0) {
        throw new Error('Seu carrinho está vazio.');
      }

      let subtotal = 0;

      const itensPedido = [];
      const produtosMap = new Map();

      // Conferir produtos e estoque
      for (const item of carrinho.itens) {
        const produtoId = item.produto.toString();

        let produto = produtosMap.get(produtoId);

        if (!produto) {
          produto = await Product.findById(produtoId).session(session);

          if (!produto) {
            throw new Error('Um dos produtos não foi encontrado.');
          }

          produtosMap.set(produtoId, produto);
        }

        const variacao = produto.variacoes.find(
          variacao => variacao.peso === item.peso
        );

        if (!variacao) {
          throw new Error(`Variação ${item.peso} não encontrada.`);
        }

        if (variacao.estoque < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para ${produto.nome} (${item.peso}).`
          );
        }

        const precoUnitario = variacao.preco;

        subtotal += precoUnitario * item.quantidade;

        itensPedido.push({
          produto: produto._id,
          nome: produto.nome,
          peso: item.peso,
          precoUnitario,
          quantidade: item.quantidade
        });

        variacao.estoque -= item.quantidade;
      }

      subtotal = arredondar(subtotal);

      // Desconto de 10% para pagamento em dinheiro
      const desconto = formaPagamento === 'dinheiro'
        ? arredondar(subtotal * 0.10)
        : 0;

      // Calcular frete conforme CEP e condição VIP
      const calculoFrete = calcularFrete(
        cepDestino,
        usuario.vip
      );

      const frete = calculoFrete.valorFrete;

      // Total da compra
      const total = arredondar(
        subtotal - desconto + frete
      );

      // Salvar os produtos com estoque atualizado
      for (const produto of produtosMap.values()) {
        await produto.save({ session });
      }

      // Criar pedido com dados da entrega
      const [pedido] = await Order.create(
        [{
          usuario: usuarioId,
          itens: itensPedido,
          subtotal,
          desconto,
          cepDestino: String(cepDestino).replace(/\D/g, ''),
          distanciaKm: calculoFrete.distanciaKm,
          frete,
          total,
          formaPagamento,
          status: 'confirmado'
        }],
        { session }
      );

      // Atualizar histórico de compras
      usuario.totalGasto = arredondar(
        Number(usuario.totalGasto || 0) + total
      );

      // Verificar se atingiu o limite VIP
      if (usuario.totalGasto >= LIMITE_VIP) {
        usuario.vip = true;
      }

      await usuario.save({ session });

      // Limpar carrinho
      await Cart.deleteOne(
        { _id: carrinho._id },
        { session }
      );

      resultado = {
        mensagem: 'Compra finalizada com sucesso!',
        pedido,
        entrega: calculoFrete,
        cliente: {
          nome: usuario.nome,
          totalGasto: usuario.totalGasto,
          vip: usuario.vip
        }
      };
    });

    return resultado;

  } finally {
    await session.endSession();
  }
}

module.exports = {
  finalizarCompra
};
