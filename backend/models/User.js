const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Por favor, adicione um nome'] 
    },
    username: {
        type: String,
        required: [true, 'Por favor, adicione um nome de usuário'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Por favor, adicione um e-mail'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, adicione um e-mail válido'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Por favor, adicione um telefone']
    },
    password: {
        type: String,
        required: [true, 'Por favor, adicione uma senha'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['medico', 'admin'],
        default: 'medico'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);