import React from 'react';
import './Statistics.css';

const Statistics = ({ patients }) => (
  <div className="content">
    <h2>Estatísticas Gerais</h2>
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Pacientes</h3>
        <p>{patients.length}</p>
      </div>
      <div className="stat-card">
        <h3>Hemofilia A</h3>
        <p>
          {patients.filter(p => p.hemophiliaType === 'A').length}
        </p>
      </div>
    </div>
  </div>
);

export default Statistics;
