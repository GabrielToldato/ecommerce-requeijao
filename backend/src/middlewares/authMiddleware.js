
const jwt = require('jsonwebtoken');

function autenticarUsuario(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        mensagem: 'Token de autenticação não informado.'
      });
    }

    const [tipo, token] = authorization.split(' ');

    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({
        mensagem: 'Formato do token inválido.'
      });
    }

    const segredo = process.env.JWT_SECRET;

    const dadosUsuario = jwt.verify(token, segredo);

    req.usuario = {
      id: dadosUsuario.id,
      email: dadosUsuario.email
    };

    next();

  } catch (error) {
    return res.status(401).json({
      mensagem: 'Token inválido ou expirado.'
    });
  }
}

module.exports = autenticarUsuario;
