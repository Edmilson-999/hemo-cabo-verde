const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

/**
 * @route POST /api/auth/register
 * @desc Registrar novo usuário
 * @access Public
 */
router.post(
  '/register',
  [
    check('username', 'Username é obrigatório').not().isEmpty(),
    check('password', 'Password deve ter 6+ caracteres').isLength({ min: 6 })
  ],
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Autenticar usuário
 * @access Public
 */
router.post(
  '/login',
  [
    check('username', 'Username é obrigatório').not().isEmpty(),
    check('password', 'Password é obrigatório').exists()
  ],
  authController.login
);

/**
 * @route GET /api/auth/user
 * @desc Obter informações do usuário logado
 * @access Private
 */
router.get(
  '/user',
  authController.getUser
);

module.exports = router;