
const {
  finalizarCompra
} = require('../services/checkoutService');

async function concluirCompra(req, res) {
  try {
    const { formaPagamento, cepDestino } = req.body;

    if (!formaPagamento) {
      return res.status(400).json({
        mensagem: 'Informe a forma de pagamento.'
      });
    }

    if (!cepDestino) {
      return res.status(400).json({
        mensagem: 'Informe o CEP de destino.'
      });
    }

    const resultado = await finalizarCompra(
      req.usuario.id,
      formaPagamento,
      cepDestino
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
