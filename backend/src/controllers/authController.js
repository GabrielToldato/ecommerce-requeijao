
const User = require('../models/User');

const {
  criptografarSenha,
  compararSenhas,
  gerarToken
} = require('../services/authService');

// CADASTRO DE USUÁRIO
async function cadastrarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        mensagem: 'Nome, e-mail e senha são obrigatórios.'
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        mensagem: 'A senha deve ter pelo menos 6 caracteres.'
      });
    }

    const usuarioExistente = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: 'Este e-mail já está cadastrado.'
      });
    }

    const senhaCriptografada = await criptografarSenha(senha);

    const usuario = await User.create({
      nome,
      email: email.toLowerCase().trim(),
      senha: senhaCriptografada
    });

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        vip: usuario.vip
      }
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao cadastrar usuário.'
    });
  }
}

// LOGIN DE USUÁRIO
async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: 'E-mail e senha são obrigatórios.'
      });
    }

    const usuario = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!usuario) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.'
      });
    }

    const senhaValida = await compararSenhas(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: 'E-mail ou senha inválidos.'
      });
    }

    const token = gerarToken(usuario);

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        vip: usuario.vip
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);

    return res.status(500).json({
      mensagem: 'Erro interno ao realizar login.'
    });
  }
}

// EXPORTAR FUNÇÕES
module.exports = {
  cadastrarUsuario,
  loginUsuario
};

