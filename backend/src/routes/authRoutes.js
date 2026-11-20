
const express = require('express');

const {
  cadastrarUsuario,
  loginUsuario
} = require('../controllers/authController');

const router = express.Router();

// Cadastro de usuário
router.post('/register', cadastrarUsuario);

// Login de usuário
router.post('/login', loginUsuario);

module.exports = router;

