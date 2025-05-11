import React from 'react';
import { Link } from 'react-router-dom';
import './PatientsList.css'; 

const PatientsList = ({ patients, searchTerm, setSearchTerm }) => (
  <div className="content">
    <div className="header">
      <h2>Pacientes Cadastrados</h2>
      <input
        type="text"
        placeholder="Buscar paciente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tipo Hemofilia</th>
          <th>Última Consulta</th>
        </tr>
      </thead>
      <tbody>
        {patients
          .filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(patient => (
            <tr key={patient.id}>
              <td>
                <Link to={`/patient/${patient.id}`}>{patient.name}</Link>
              </td>
              <td>{patient.hemophiliaType}</td>
              <td>{new Date(patient.lastVisit).toLocaleDateString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default PatientsList;
