const Patient = require('../models/Patient');
const { validationResult } = require('express-validator');

/**
 * @route POST /api/patients
 * @access Privado (Médico/Admin)
 */
const createPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, birthDate, hemophiliaType, severity, contact, address, healthStatus } = req.body;

    const newPatient = new Patient({
      fullName,
      birthDate,
      hemophiliaType,
      severity,
      contact,
      address,
      healthStatus,
      createdBy: req.user.id 
    });

    const savedPatient = await newPatient.save();
    
    res.status(201).json({
      success: true,
      data: savedPatient,
      message: 'Paciente cadastrado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao criar paciente:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar paciente',
      error: err.message
    });
  }
};

/**
 * @route GET /api/patients
 * @access Privado (Médico/Admin)
 */
const getAllPatients = async (req, res) => {
  try {
    const { search, hemophiliaType, severity, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (search) {
      query.fullName = { $regex: search, $options: 'i' };
    }
    
    if (hemophiliaType) {
      query.hemophiliaType = hemophiliaType;
    }
    
    if (severity) {
      query.severity = severity;
    }

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email'); 

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error('Erro ao buscar pacientes:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pacientes',
      error: err.message
    });
  }
};

/**
 * @route GET /api/patients/:id
 * @access Privado (Médico/Admin)
 */
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado'
      });
    }

    res.json({
      success: true,
      data: patient
    });

  } catch (err) {
    console.error('Erro ao buscar paciente:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar paciente',
      error: err.message
    });
  }
};

/**
 * @route PUT /api/patients/:id
 * @access Privado (Médico/Admin)
 */
const updatePatient = async (req, res) => {
  try {
    const { fullName, birthDate, hemophiliaType, severity, contact, address, healthStatus } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        birthDate,
        hemophiliaType,
        severity,
        contact,
        address,
        healthStatus
      },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado'
      });
    }

    res.json({
      success: true,
      data: updatedPatient,
      message: 'Paciente atualizado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao atualizar paciente:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar paciente',
      error: err.message
    });
  }
};

/**
 * @route DELETE /api/patients/:id
 * @access Privado (Admin)
 */
const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);

    if (!deletedPatient) {
      return res.status(404).json({
        success: false,
        message: 'Paciente não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Paciente removido com sucesso'
    });

  } catch (err) {
    console.error('Erro ao remover paciente:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover paciente',
      error: err.message
    });
  }
};

/**
 * @route GET /api/patients/stats
 * @access Privado (Médico/Admin)
 */
const getPatientStats = async (req, res) => {
  try {
    const stats = await Patient.aggregate([
      {
        $group: {
          _id: '$hemophiliaType',
          count: { $sum: 1 },
          averageAge: {
            $avg: {
              $divide: [
                { $subtract: [new Date(), '$birthDate'] },
                365 * 24 * 60 * 60 * 1000 
              ]
            }
          },
          bySeverity: {
            $push: {
              severity: '$severity',
              count: 1
            }
          }
        }
      },
      {
        $project: {
          hemophiliaType: '$_id',
          count: 1,
          averageAge: { $round: ['$averageAge', 1] },
          severityDistribution: {
            $reduce: {
              input: '$bySeverity',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  {
                    $cond: [
                      { $in: ['$$this.severity', '$$value.severity'] },
                      [],
                      ['$$this']
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });

  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: err.message
    });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientStats
};