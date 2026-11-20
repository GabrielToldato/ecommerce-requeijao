
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

async function criptografarSenha(senha) {
  return await bcrypt.hash(senha, SALT_ROUNDS);
}

async function compararSenhas(senha, senhaCriptografada) {
  return await bcrypt.compare(senha, senhaCriptografada);
}

function gerarToken(usuario) {
  const segredo = process.env.JWT_SECRET;

  if (!segredo) {
    throw new Error('JWT_SECRET não configurado.');
  }

  return jwt.sign(
    {
      id: usuario._id,
      email: usuario.email
    },
    segredo,
    {
      expiresIn: '1d'
    }
  );
}

module.exports = {
  criptografarSenha,
  compararSenhas,
  gerarToken
};
