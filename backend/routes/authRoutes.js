const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  register,
  login,
  getMe,
  verifyToken
} = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

router.post('/register', [
  check('name', 'Nome é obrigatório').not().isEmpty(),
  check('username', 'Nome de usuário é obrigatório').not().isEmpty(),
  check('email', 'Por favor, inclua um e-mail válido').isEmail(),
  check('phone', 'Telefone é obrigatório').not().isEmpty(),
  check('password', 'Senha deve ter 6+ caracteres').isLength({ min: 6 })
], register);

router.post('/login', [
  check('email', 'Inclua um e-mail válido').isEmail(),
  check('password', 'Senha é obrigatória').exists()
], login);

router.get('/me', auth, getMe);

router.get('/verify', auth, verifyToken);

module.exports = router;