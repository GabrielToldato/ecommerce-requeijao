
const {
  finalizarCompra
} = require('../services/checkoutService');

async function concluirCompra(req, res) {
  try {
    const { formaPagamento } = req.body;

    if (!formaPagamento) {
      return res.status(400).json({
        mensagem: 'Informe a forma de pagamento.'
      });
    }

    const resultado = await finalizarCompra(
      req.usuario.id,
      formaPagamento
    );

    return res.status(201).json(resultado);

  } catch (error) {
    console.error('Erro ao finalizar compra:', error);

    return res.status(400).json({
      mensagem: error.message
    });
  }
}

module.exports = {
  concluirCompra
};
