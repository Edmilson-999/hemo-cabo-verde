import React from 'react';
import './Sidebar.css';


const Sidebar = ({ user, currentView, setCurrentView }) => (
  <div className="sidebar">
    <div className="user-info">
      <h3>{user.name}</h3>
      <p>{user.role.toUpperCase()}</p>
    </div>

    <nav>
      <button 
        className={currentView === 'patients' ? 'active' : ''}
        onClick={() => setCurrentView('patients')}
      >
        Lista de Pacientes
      </button>

      <button
        className={currentView === 'stats' ? 'active' : ''}
        onClick={() => setCurrentView('stats')}
      >
        Estatísticas
      </button>

      {user.role === 'admin' && (
        <button
          className={currentView === 'users' ? 'active' : ''}
          onClick={() => setCurrentView('users')}
        >
          Gestão de Usuários
        </button>
      )}
    </nav>
  </div>
);

export default Sidebar;
