const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

/**
 * @desc    Registra um novo usuário (médico ou admin)
 * @route   POST /api/auth/register
 * @access  Público
 */
const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, username, email, phone, password, role } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ 
                success: false,
                message: 'E-mail já cadastrado' 
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ 
                success: false,
                message: 'Nome de usuário já existe' 
            });
        }

        const user = new User({ 
            name, 
            username,
            email, 
            phone,
            password, 
            role: role || 'medico' 
        });

        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: 'Registro realizado com sucesso'
        });

    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor',
            error: err.message
        });
    }
};

/**
 * @desc    Autentica um usuário
 * @route   POST /api/auth/login
 * @access  Público
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor, forneça e-mail e senha'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: 'Login realizado com sucesso'
        });

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor',
            error: err.message
        });
    }
};

/**
 * @desc    Obtém informações do usuário logado
 * @route   GET /api/auth/me
 * @access  Privado
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        res.status(500).json({
            success: false,
            message: 'Erro no servidor'
        });
    }
};

/**
 * @desc    Verifica se um token é válido
 * @route   GET /api/auth/verify
 * @access  Privado
 */
const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Erro na verificação de token:', err);
        res.status(500).json({
            success: false,
            message: 'Erro na verificação de token'
        });
    }
};

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
};

module.exports = {
    register,
    login,
    getMe,
    verifyToken
};