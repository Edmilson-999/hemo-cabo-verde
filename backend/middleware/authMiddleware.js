const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.jWT_SECRET);
        const user = await User.findOne(decoded.UserId);
        
        if(!user) {
            throw new Error();
        }

        req.token = token
        req.user = user
        next();
    } catch (err) {
        res.status(401).json({ message: 'Por favor, autentique-se' })
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso não autorizado' })
        }
        next();
    };
};

module.exports = { auth, authorize };