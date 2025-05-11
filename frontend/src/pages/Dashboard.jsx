import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Dashboard/Sidebar';
import PatientsList from '../components/Dashboard/PatientsList';
import Statistics from '../components/Dashboard/Statistics';
import AddPatient from '../components/Dashboard/AddPatient';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [user] = useState({
    role: 'medico',
    name: 'Dra Conceição Silva'
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://api.example.com/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar 
        user={user} 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
      />
      {currentView === 'patients' && (
        <PatientsList 
          patients={patients} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      )}
      {currentView === 'stats' && <Statistics patients={patients} />}
      {currentView === 'add-patient' && <AddPatient />}
    </div>
  );
};

export default Dashboard;
