
const API_URL = 'http://localhost:3000/api';

let token = null;
let usuario = null;
let produtos = [];
let carrinho = [];

// ELEMENTOS DA TELA
const secaoAutenticacao = document.getElementById('secaoAutenticacao');
const secaoLoja = document.getElementById('secaoLoja');

const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');

const mensagemAutenticacao = document.getElementById('mensagemAutenticacao');
const listaProdutos = document.getElementById('listaProdutos');

const itensCarrinho = document.getElementById('itensCarrinho');
const mensagemCompra = document.getElementById('mensagemCompra');

// FORMATAÇÃO DE VALORES
function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// REQUISIÇÕES À API
async function requisicao(endpoint, metodo = 'GET', dados = null) {
  const configuracao = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    configuracao.headers.Authorization = `Bearer ${token}`;
  }

  if (dados) {
    configuracao.body = JSON.stringify(dados);
  }

  const resposta = await fetch(`${API_URL}${endpoint}`, configuracao);
  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.mensagem || 'Erro na comunicação com o servidor.');
  }

  return resultado;
}

// ALTERNAR LOGIN E CADASTRO
document.getElementById('abaLogin').addEventListener('click', () => {
  formLogin.hidden = false;
  formCadastro.hidden = true;

  document.getElementById('abaLogin').classList.add('ativa');
  document.getElementById('abaCadastro').classList.remove('ativa');

  mensagemAutenticacao.textContent = '';
});

document.getElementById('abaCadastro').addEventListener('click', () => {
  formLogin.hidden = true;
  formCadastro.hidden = false;

  document.getElementById('abaCadastro').classList.add('ativa');
  document.getElementById('abaLogin').classList.remove('ativa');

  mensagemAutenticacao.textContent = '';
});

// LOGIN
formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  mensagemAutenticacao.textContent = 'Entrando...';

  try {
    const resultado = await requisicao('/auth/login', 'POST', {
      email: document.getElementById('loginEmail').value,
      senha: document.getElementById('loginSenha').value
    });

    if (!resultado.token) {
      throw new Error('O servidor não retornou o token de acesso.');
    }

    token = resultado.token;

    usuario = resultado.usuario || resultado.cliente || {
      nome: document.getElementById('loginEmail').value,
      vip: false,
      totalGasto: 0
    };

    await iniciarLoja();

  } catch (error) {
    mensagemAutenticacao.textContent = error.message;
  }
});

// CADASTRO
formCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  mensagemAutenticacao.textContent = 'Criando sua conta...';

  try {
    await requisicao('/auth/register', 'POST', {
      nome: document.getElementById('cadastroNome').value,
      email: document.getElementById('cadastroEmail').value,
      senha: document.getElementById('cadastroSenha').value
    });

    mensagemAutenticacao.textContent =
      'Cadastro realizado! Agora entre com seu e-mail e senha.';

    formCadastro.reset();
    document.getElementById('abaLogin').click();

  } catch (error) {
    mensagemAutenticacao.textContent = error.message;
  }
});

// INICIAR LOJA
async function iniciarLoja() {
  secaoAutenticacao.hidden = true;
  secaoLoja.hidden = false;

  document.getElementById('nomeCliente').textContent =
    `Olá, ${usuario.nome || 'cliente'}!`;

  document.getElementById('botaoSair').hidden = false;

  await carregarProdutos();
  await consultarCarrinho();
  atualizarStatusVip();
}

// CARREGAR PRODUTOS
async function carregarProdutos() {
  try {
    const resultado = await requisicao('/products');

    produtos = resultado.produtos || [];
    listaProdutos.innerHTML = '';

    produtos.forEach(produto => {
      const card = document.createElement('article');
      card.className = 'produto-card';

      const titulo = document.createElement('h3');
      titulo.textContent = produto.nome;

      const descricao = document.createElement('p');
      descricao.textContent = produto.descricao;

      const preco = document.createElement('p');
      preco.className = 'preco';

      const estoque = document.createElement('p');
      estoque.className = 'estoque';

      const seletor = document.createElement('select');
      seletor.setAttribute('aria-label', `Peso de ${produto.nome}`);

      produto.variacoes.forEach(variacao => {
        const opcao = document.createElement('option');

        opcao.value = variacao.peso;
        opcao.textContent =
          `${variacao.peso} - ${formatarMoeda(variacao.preco)}`;

        opcao.disabled = variacao.estoque <= 0;

        seletor.appendChild(opcao);
      });

      const quantidade = document.createElement('input');
      quantidade.type = 'number';
      quantidade.min = '1';
      quantidade.step = '1';
      quantidade.value = '1';

      quantidade.setAttribute(
        'aria-label',
        `Quantidade de ${produto.nome}`
      );

      const botao = document.createElement('button');
      botao.textContent = 'Adicionar ao carrinho';

      function atualizarVariacao() {
        const variacao = produto.variacoes.find(
          item => item.peso === seletor.value
        );

        if (!variacao) {
          preco.textContent = 'Variação indisponível';
          estoque.textContent = 'Sem estoque';
          botao.disabled = true;
          return;
        }

        preco.textContent = formatarMoeda(variacao.preco);

        estoque.textContent =
          `Estoque disponível: ${variacao.estoque} unidade(s)`;

        botao.disabled = variacao.estoque <= 0;
      }

      seletor.addEventListener('change', atualizarVariacao);

      botao.addEventListener('click', async () => {
        const quantidadeInformada = Number(quantidade.value);

        if (!Number.isInteger(quantidadeInformada) ||
            quantidadeInformada <= 0) {
          alert('Informe uma quantidade válida.');
          return;
        }

        try {
          await requisicao('/cart/add', 'POST', {
            produtoId: produto._id,
            peso: seletor.value,
            quantidade: quantidadeInformada
          });

          alert('Produto adicionado ao carrinho!');

          await consultarCarrinho();
          await carregarProdutos();

        } catch (error) {
          alert(error.message);
        }
      });

      card.append(
        titulo,
        descricao,
        preco,
        seletor,
        quantidade,
        estoque,
        botao
      );

      atualizarVariacao();
      listaProdutos.appendChild(card);
    });

  } catch (error) {
    listaProdutos.textContent = error.message;
  }
}

// CONSULTAR CARRINHO
async function consultarCarrinho() {
  try {
    const resultado = await requisicao('/cart');

    carrinho = resultado.carrinho?.itens || resultado.itens || [];

    renderizarCarrinho();

  } catch (error) {
    console.error('Erro ao consultar carrinho:', error);
  }
}

// REMOVER PRODUTO DO CARRINHO
async function removerItemCarrinho(produtoId, peso) {
  const confirmar = confirm(
    'Deseja realmente remover este produto do carrinho?'
  );

  if (!confirmar) {
    return;
  }

  try {
    await requisicao('/cart/remove', 'DELETE', {
      produtoId,
      peso
    });

    await consultarCarrinho();
    await carregarProdutos();

    alert('Produto removido do carrinho!');

  } catch (error) {
    alert(error.message);
  }
}

// EXIBIR CARRINHO
function renderizarCarrinho() {
  itensCarrinho.innerHTML = '';

  let subtotal = 0;
  let quantidadeTotal = 0;

  if (carrinho.length === 0) {
    itensCarrinho.textContent = 'Seu carrinho está vazio.';
  }

  carrinho.forEach(item => {
    const produto = item.produto;

    if (!produto || typeof produto === 'string') {
      return;
    }

    const variacao = produto.variacoes.find(
      v => v.peso === item.peso
    );

    if (!variacao) {
      return;
    }

    const valorItem = variacao.preco * item.quantidade;

    subtotal += valorItem;
    quantidadeTotal += item.quantidade;

    const linha = document.createElement('div');
    linha.className = 'item-carrinho';

    const descricao = document.createElement('span');
    descricao.textContent =
      `${produto.nome} - ${item.peso} × ${item.quantidade}`;

    const valor = document.createElement('strong');
    valor.textContent = formatarMoeda(valorItem);

    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.type = 'button';
    botaoRemover.className = 'botao-remover';

    botaoRemover.addEventListener('click', () => {
      removerItemCarrinho(produto._id, item.peso);
    });

    linha.append(descricao, valor, botaoRemover);

    itensCarrinho.appendChild(linha);
  });

  const desconto =
    document.getElementById('formaPagamento').value === 'dinheiro'
      ? subtotal * 0.10
      : 0;

  const frete = usuario?.vip ? 0 : 45;

  document.getElementById('contadorCarrinho').textContent =
    quantidadeTotal;

  document.getElementById('subtotal').textContent =
    formatarMoeda(subtotal);

  document.getElementById('desconto').textContent =
    formatarMoeda(desconto);

  document.getElementById('frete').textContent =
    formatarMoeda(frete);

  document.getElementById('total').textContent =
    formatarMoeda(subtotal - desconto + frete);
}

// ATUALIZAR VALORES AO TROCAR PAGAMENTO
document.getElementById('formaPagamento').addEventListener(
  'change',
  renderizarCarrinho
);

// ABRIR E FECHAR CARRINHO
document.getElementById('botaoCarrinho').addEventListener('click', async () => {
  await consultarCarrinho();

  document.getElementById('secaoCarrinho').classList.add('aberto');

  document.getElementById('secaoCarrinho').scrollIntoView({
    behavior: 'smooth'
  });
});

document.getElementById('fecharCarrinho').addEventListener('click', () => {
  document.getElementById('secaoCarrinho').classList.remove('aberto');
});

// ATUALIZAR STATUS VIP
function atualizarStatusVip() {
  const statusVip = document.getElementById('statusVip');
  const textoProgresso = document.getElementById('textoProgressoVip');
  const barraVip = document.getElementById('barraVip');

  const totalGasto = Number(usuario?.totalGasto || 0);
  const vip = Boolean(usuario?.vip);

  if (vip) {
    statusVip.textContent = '⭐ Cliente VIP';
    statusVip.classList.add('vip');

    textoProgresso.textContent =
      'Parabéns! Você já é cliente VIP e tem frete grátis.';

    barraVip.style.width = '100%';

  } else {
    statusVip.textContent = 'Cliente comum';
    statusVip.classList.remove('vip');

    const progresso = Math.min((totalGasto / 300) * 100, 100);
    const restante = Math.max(300 - totalGasto, 0);

    textoProgresso.textContent =
      `Você já gastou ${formatarMoeda(totalGasto)}. ` +
      `Faltam ${formatarMoeda(restante)} para alcançar o VIP.`;

    barraVip.style.width = `${progresso}%`;
  }
}

// FINALIZAR COMPRA
document.getElementById('formFinalizarCompra').addEventListener(
  'submit',
  async (evento) => {
    evento.preventDefault();

    if (carrinho.length === 0) {
      mensagemCompra.textContent = 'Seu carrinho está vazio.';
      return;
    }

    const formaPagamento =
      document.getElementById('formaPagamento').value;

    mensagemCompra.textContent = 'Processando sua compra...';

    try {
      const resultado = await requisicao(
        '/checkout/finalizar',
        'POST',
        { formaPagamento }
      );

      mensagemCompra.textContent =
        resultado.mensagem || 'Compra finalizada com sucesso!';

      document.getElementById('detalhesCompra').innerHTML = '';

      const pedido = resultado.pedido;

      if (pedido) {
        const detalhes = [
          `Pedido: ${pedido._id}`,
          `Subtotal: ${formatarMoeda(pedido.subtotal)}`,
          `Desconto: ${formatarMoeda(pedido.desconto)}`,
          `Frete: ${formatarMoeda(pedido.frete)}`,
          `Total: ${formatarMoeda(pedido.total)}`,
          `Pagamento: ${pedido.formaPagamento}`
        ];

        detalhes.forEach(texto => {
          const paragrafo = document.createElement('p');
          paragrafo.textContent = texto;

          document.getElementById('detalhesCompra').appendChild(paragrafo);
        });
      }

      if (resultado.cliente) {
        usuario = {
          ...usuario,
          ...resultado.cliente
        };
      }

      carrinho = [];

      document.getElementById('resultadoCompra').hidden = false;

      atualizarStatusVip();

      await consultarCarrinho();
      await carregarProdutos();

      document.getElementById('secaoCarrinho').classList.remove('aberto');

    } catch (error) {
      mensagemCompra.textContent = error.message;
    }
  }
);

// SAIR DA CONTA
document.getElementById('botaoSair').addEventListener('click', () => {
  token = null;
  usuario = null;
  carrinho = [];

  secaoLoja.hidden = true;
  secaoAutenticacao.hidden = false;

  document.getElementById('botaoSair').hidden = true;
  document.getElementById('nomeCliente').textContent = 'Bem-vindo!';

  formLogin.reset();
  formCadastro.reset();

  document.getElementById('resultadoCompra').hidden = true;
  document.getElementById('secaoCarrinho').classList.remove('aberto');

  document.getElementById('abaLogin').click();
});
