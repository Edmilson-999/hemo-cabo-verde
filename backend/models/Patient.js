const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    birthDate: { type: Date, require: true },
    hemophiliaType: {
        type: String,
        enum: ['A', 'B'],
        required: true
    },
    severity: {
        type: String,
        enum: ['leve', 'moderada', 'grave'],
        required: true
    },
    contact: { type: String, required: true },
    address: { type: String },
    healthStatus: {
        type: String,
        enum: [ 'estável', 'tratamento', 'crítico' ],
        default: 'estável'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);