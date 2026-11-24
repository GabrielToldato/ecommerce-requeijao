
const CEP_ORIGEM = '16195014';
const VALOR_POR_KM = 1.00;

// Distâncias ilustrativas para simulação do projeto.
const distanciasCEP = [
  { inicio: '16000000', fim: '16999999', distanciaKm: 50 },
  { inicio: '17000000', fim: '17999999', distanciaKm: 100 },
  { inicio: '15000000', fim: '15999999', distanciaKm: 150 },
  { inicio: '14000000', fim: '14999999', distanciaKm: 200 }
];

function calcularFrete(cepDestino, vip = false) {
  if (vip) {
    return {
      distanciaKm: 0,
      valorFrete: 0,
      mensagem: 'Frete grátis para cliente VIP.'
    };
  }

  const cep = String(cepDestino).replace(/\D/g, '');

  if (cep.length !== 8) {
    throw new Error('CEP inválido. Informe um CEP com 8 dígitos.');
  }

  if (cep === CEP_ORIGEM) {
    return {
      distanciaKm: 0,
      valorFrete: 0,
      mensagem: 'Entrega no CEP de origem.'
    };
  }

  const regiao = distanciasCEP.find(
    faixa => cep >= faixa.inicio && cep <= faixa.fim
  );

  if (!regiao) {
    throw new Error(
      'Não atendemos esse CEP ou não temos distância cadastrada.'
    );
  }

  const valorFrete = Number(
    (regiao.distanciaKm * VALOR_POR_KM).toFixed(2)
  );

  return {
    distanciaKm: regiao.distanciaKm,
    valorFrete,
    mensagem: 'Frete calculado com distância estimada.'
  };
}

module.exports = { calcularFrete };