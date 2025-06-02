const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Importe a conexão com o banco de dados

const auth = async (req, res, next) => {
    try {
        // Verifica se o cabeçalho de autorização existe
        if (!req.header('Authorization')) {
            throw new Error();
        }

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Corrigido para JWT_SECRET
        
        // Consulta ao usuário adaptada para SQLite
        db.get(
            'SELECT * FROM users WHERE _id = ?', 
            [decoded.id], // Alterado para decoded.id para consistência
            (err, user) => {
                if (err || !user) {
                    throw new Error();
                }

                req.token = token;
                req.user = user;
                next();
            }
        );
    } catch (err) {
        res.status(401).json({ 
            success: false,
            message: 'Por favor, autentique-se' 
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: 'Acesso não autorizado' 
            });
        }
        next();
    };
};

module.exports = { 
    auth, 
    authorize 
};