const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientStats
} = require('../controllers/patientController');

router.use(auth);

router.route('/')
  .post(authorize('medico', 'admin'), createPatient)
  .get(authorize('medico', 'admin'), getAllPatients);

router.route('/stats')
  .get(authorize('medico', 'admin'), getPatientStats);

router.route('/:id')
  .get(authorize('medico', 'admin'), getPatientById)
  .put(authorize('medico', 'admin'), updatePatient)
  .delete(authorize('admin'), deletePatient);

module.exports = router;