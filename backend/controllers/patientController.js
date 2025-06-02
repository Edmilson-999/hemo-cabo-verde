const { validationResult } = require('express-validator');
const { calculateAge } = require('../utils/helpers'); // Você precisará criar esta função

exports.createPatient = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = req.app.get('db');
  const { fullName, birthDate, hemophiliaType, severity, contact, address, healthStatus } = req.body;
  const patientId = require('uuid').v4().replace(/-/g, '').substring(0, 24);

  db.run(
    `INSERT INTO patients (
      _id, fullName, birthDate, hemophiliaType, severity, 
      contact, address, healthStatus, createdBy, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      patientId, fullName, birthDate, hemophiliaType, severity,
      contact, address, healthStatus, req.user.id
    ],
    function(err) {
      if (err) {
        console.error('Erro ao criar paciente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao cadastrar paciente',
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        data: {
          _id: patientId,
          fullName,
          birthDate,
          hemophiliaType,
          severity,
          contact,
          address,
          healthStatus,
          createdBy: req.user.id
        },
        message: 'Paciente cadastrado com sucesso'
      });
    }
  );
};

exports.getAllPatients = (req, res) => {
  const db = req.app.get('db');
  const { search, hemophiliaType, severity, page = 1, limit = 10 } = req.query;
  
  let query = 'SELECT * FROM patients WHERE 1=1';
  const params = [];
  
  if (search) {
    query += ' AND fullName LIKE ?';
    params.push(`%${search}%`);
  }
  
  if (hemophiliaType) {
    query += ' AND hemophiliaType = ?';
    params.push(hemophiliaType);
  }
  
  if (severity) {
    query += ' AND severity = ?';
    params.push(severity);
  }

  // Adiciona ordenação e paginação
  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (page - 1) * limit);

  // Primeiro busca os pacientes
  db.all(query, params, (err, patients) => {
    if (err) {
      console.error('Erro ao buscar pacientes:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar pacientes',
        error: err.message
      });
    }

    // Depois conta o total (para paginação)
    let countQuery = 'SELECT COUNT(*) as total FROM patients WHERE 1=1';
    const countParams = params.slice(0, -2); // Remove LIMIT e OFFSET
    
    db.get(countQuery, countParams, (countErr, result) => {
      if (countErr) {
        console.error('Erro ao contar pacientes:', countErr);
        return res.status(500).json({
          success: false,
          message: 'Erro ao contar pacientes',
          error: countErr.message
        });
      }

      // Para cada paciente, busca o usuário que o criou
      const patientsWithCreator = patients.map(patient => {
        return new Promise((resolve) => {
          db.get(
            'SELECT _id, username FROM users WHERE _id = ?',
            [patient.createdBy],
            (userErr, user) => {
              if (userErr || !user) {
                resolve({ ...patient, createdBy: null });
              } else {
                resolve({ ...patient, createdBy: user });
              }
            }
          );
        });
      });

      Promise.all(patientsWithCreator).then(completePatients => {
        res.json({
          success: true,
          data: completePatients,
          pagination: {
            total: result.total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(result.total / limit)
          }
        });
      });
    });
  });
};

exports.getPatientById = (req, res) => {
  const db = req.app.get('db');
  
  db.get(
    'SELECT * FROM patients WHERE _id = ?',
    [req.params.id],
    (err, patient) => {
      if (err) {
        console.error('Erro ao buscar paciente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar paciente',
          error: err.message
        });
      }

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        });
      }

      // Busca o usuário que criou o paciente
      db.get(
        'SELECT _id, username FROM users WHERE _id = ?',
        [patient.createdBy],
        (userErr, user) => {
          res.json({
            success: true,
            data: {
              ...patient,
              createdBy: user || null
            }
          });
        }
      );
    }
  );
};

exports.updatePatient = (req, res) => {
  const db = req.app.get('db');
  const { fullName, birthDate, hemophiliaType, severity, contact, address, healthStatus } = req.body;

  db.run(
    `UPDATE patients SET 
      fullName = ?,
      birthDate = ?,
      hemophiliaType = ?,
      severity = ?,
      contact = ?,
      address = ?,
      healthStatus = ?
    WHERE _id = ?`,
    [
      fullName, birthDate, hemophiliaType, severity,
      contact, address, healthStatus, req.params.id
    ],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar paciente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao atualizar paciente',
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Paciente atualizado com sucesso',
        data: {
          _id: req.params.id,
          fullName,
          birthDate,
          hemophiliaType,
          severity,
          contact,
          address,
          healthStatus
        }
      });
    }
  );
};

exports.deletePatient = (req, res) => {
  const db = req.app.get('db');

  db.run(
    'DELETE FROM patients WHERE _id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        console.error('Erro ao remover paciente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao remover paciente',
          error: err.message
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Paciente não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Paciente removido com sucesso'
      });
    }
  );
};

exports.getPatientStats = (req, res) => {
  const db = req.app.get('db');

  // Consulta para estatísticas por tipo de hemofilia
  db.all(
    `SELECT 
      hemophiliaType,
      COUNT(*) as count,
      AVG((julianday('now') - julianday(birthDate))/365) as averageAge
    FROM patients
    GROUP BY hemophiliaType`,
    (err, typeStats) => {
      if (err) {
        console.error('Erro ao buscar estatísticas:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar estatísticas',
          error: err.message
        });
      }

      // Consulta para distribuição por severidade
      db.all(
        `SELECT 
          hemophiliaType,
          severity,
          COUNT(*) as count
        FROM patients
        GROUP BY hemophiliaType, severity`,
        (severityErr, severityStats) => {
          if (severityErr) {
            console.error('Erro ao buscar estatísticas:', severityErr);
            return res.status(500).json({
              success: false,
              message: 'Erro ao buscar estatísticas',
              error: severityErr.message
            });
          }

          // Formata os resultados
          const stats = typeStats.map(type => {
            return {
              hemophiliaType: type.hemophiliaType,
              count: type.count,
              averageAge: Math.round(type.averageAge * 10) / 10,
              severityDistribution: severityStats
                .filter(s => s.hemophiliaType === type.hemophiliaType)
                .map(s => ({ severity: s.severity, count: s.count }))
            };
          });

          res.json({
            success: true,
            data: stats
          });
        }
      );
    }
  );
};

// Funções para itens (já adaptadas anteriormente)
exports.getPatientItems = (req, res) => {
  const db = req.app.get('db');
  const { patientId } = req.params;

  db.all(
    'SELECT * FROM items WHERE patient_id = ? ORDER BY created_at DESC',
    [patientId],
    (err, items) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar itens'
        });
      }
      res.json({ success: true, data: items });
    }
  );
};

exports.addItem = (req, res) => {
  const db = req.app.get('db');
  const { patientId } = req.params;
  const { name, imageUrl } = req.body;
  const itemId = require('uuid').v4().replace(/-/g, '').substring(0, 24);

  db.run(
    `INSERT INTO items (_id, name, imageUrl, patient_id, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [itemId, name, imageUrl, patientId],
    function(err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao adicionar item'
        });
      }

      res.status(201).json({
        success: true,
        data: {
          _id: itemId,
          name,
          imageUrl,
          patient_id: patientId
        }
      });
    }
  );
};