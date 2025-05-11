import React, { useState } from 'react';
import './AddPatient.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    hemophiliaType: 'A',
    severity: 'moderate',
    contact: '',
    address: '',
    healthStatus: 'stable'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/patients', formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao cadastrar paciente');
    }
  };

  return (
    <div className="add-patient-container">
      <h2>Cadastrar Novo Paciente</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Paciente cadastrado com sucesso!</div>}

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Hemofilia</label>
            <select
              name="hemophiliaType"
              value={formData.hemophiliaType}
              onChange={handleChange}
              required
            >
              <option value="A">Hemofilia A</option>
              <option value="B">Hemofilia B</option>
              <option value="C">Hemofilia C</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gravidade</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
            >
              <option value="mild">Leve</option>
              <option value="moderate">Moderada</option>
              <option value="severe">Grave</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Contato</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Estado de Saúde</label>
          <select
            name="healthStatus"
            value={formData.healthStatus}
            onChange={handleChange}
          >
            <option value="stable">Estável</option>
            <option value="treatment">Em Tratamento</option>
            <option value="critical">Crítico</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Cadastrar Paciente
        </button>
      </form>
    </div>
  );
};

export default AddPatient;