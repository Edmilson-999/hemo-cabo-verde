const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

exports.register = (req, res) => {
    const db = req.app.get('db');
    const { username, password, role = 'user' } = req.body;

    // 1. Verificar se usuário já existe
    db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao verificar usuário existente'
            });
        }

        if (row) {
            return res.status(400).json({
                success: false,
                message: 'Nome de usuário já existe'
            });
        }

        // 2. Criar hash da senha
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao criar hash da senha'
                });
            }

            // 3. Inserir novo usuário
            const userId = uuidv4().replace(/-/g, '').substring(0, 24);
            db.run(
                `INSERT INTO users (_id, username, password, role) VALUES (?, ?, ?, ?)`,
                [userId, username, hashedPassword, role],
                function(runErr) {
                    if (runErr) {
                        return res.status(500).json({
                            success: false,
                            message: 'Erro ao registrar usuário'
                        });
                    }

                    // 4. Gerar token JWT
                    const token = jwt.sign(
                        { id: userId, username, role },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );

                    res.status(201).json({
                        success: true,
                        token,
                        user: { id: userId, username, role }
                    });
                }
            );
        });
    });
};

exports.login = (req, res) => {
    const db = req.app.get('db');
    const { username, password } = req.body;

    // 1. Buscar usuário
    db.get(
        'SELECT _id, username, password, role FROM users WHERE username = ?',
        [username],
        (err, user) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao buscar usuário'
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // 2. Verificar senha
            bcrypt.compare(password, user.password, (compareErr, isMatch) => {
                if (compareErr || !isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Credenciais inválidas'
                    });
                }

                // 3. Gerar token JWT
                const token = jwt.sign(
                    { id: user._id, username: user.username, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({
                    success: true,
                    token,
                    user: { id: user._id, username: user.username, role: user.role }
                });
            });
        }
    );
};

exports.getUser = (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};