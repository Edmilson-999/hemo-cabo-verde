const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const { check } = require('express-validator');

// Rotas protegidas por autenticação
router.use(authMiddleware.auth);

/**
 * @route GET /api/patients
 * @access Privado (Médico/Admin)
 */
router.get('/', patientController.getAllPatients);

/**
 * @route POST /api/patients
 * @access Privado (Médico/Admin)
 */
router.post(
    '/',
    [
        check('fullName', 'Nome completo é obrigatório').not().isEmpty(),
        check('hemophiliaType', 'Tipo de hemofilia é obrigatório').not().isEmpty()
    ],
    patientController.createPatient
);

/**
 * @route GET /api/patients/:id
 * @access Privado (Médico/Admin)
 */
router.get('/:id', patientController.getPatientById);

/**
 * @route PUT /api/patients/:id
 * @access Privado (Médico/Admin)
 */
router.put('/:id', patientController.updatePatient);

/**
 * @route DELETE /api/patients/:id
 * @access Privado (Admin)
 */
router.delete('/:id', authMiddleware.authorize('admin'), patientController.deletePatient);

module.exports = router;