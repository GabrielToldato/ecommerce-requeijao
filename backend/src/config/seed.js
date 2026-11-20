
const Product = require('../models/Product');
const User = require('../models/User');
const { criptografarSenha } = require('../services/authService');

async function carregarDadosIniciais() {
  try {
    // Evita cadastrar os mesmos dados novamente
    const produtosExistentes = await Product.countDocuments();

    if (produtosExistentes > 0) {
      console.log('Dados iniciais já cadastrados.');
      return;
    }

    // Cadastro dos produtos
    const produtos = [
      {
        nome: 'Requeijão em Barra',
        descricao: 'Requeijão em barra, vendido por peso.',
        variacoes: [
          { peso: '500g', preco: 35, estoque: 15 },
          { peso: '1kg', preco: 70, estoque: 15 },
          { peso: '2kg', preco: 130, estoque: 15 }
        ]
      },
      {
        nome: 'Doce de Leite em Pedaço',
        descricao: 'Doce de leite tradicional em pedaços.',
        variacoes: [
          { peso: '500g', preco: 50, estoque: 15 },
          { peso: '1kg', preco: 75, estoque: 15 },
          { peso: '2kg', preco: 130, estoque: 15 }
        ]
      },
      {
        nome: 'Doce de Abóbora',
        descricao: 'Doce de abóbora tradicional.',
        variacoes: [
          { peso: '500g', preco: 20, estoque: 15 },
          { peso: '1kg', preco: 45, estoque: 15 },
          { peso: '2kg', preco: 90, estoque: 15 }
        ]
      }
    ];

    await Product.insertMany(produtos);

    // Cadastro dos usuários
    const usuarios = [
  {
    nome: 'Cliente VIP',
    email: 'vip@email.com',
    senha: await criptografarSenha('123456'),
    totalGasto: 350,
    vip: true
  },
  {
    nome: 'Cliente Comum 1',
    email: 'cliente1@email.com',
    senha: await criptografarSenha('123456'),
    totalGasto: 0,
    vip: false
  },
  {
    nome: 'Cliente Comum 2',
    email: 'cliente2@email.com',
    senha: await criptografarSenha('123456'),
    totalGasto: 100,
    vip: false
  }
];

    await User.insertMany(usuarios);

    console.log('Produtos cadastrados: 3');
    console.log('Variações cadastradas: 9');
    console.log('Estoque inicial: 135 unidades');
    console.log('Usuários cadastrados: 3');

  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error);
    throw error;
  }
}

module.exports = carregarDadosIniciais;
