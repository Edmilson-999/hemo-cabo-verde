import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className='home-container'>
      <img src='/Hemo.jpg' alt='Logo Hemofílicos CV' className='home-logo' />   
      <h1>Sistema Hemofílicos Cabo Verde</h1>
      <h2>Sistema de Cadastro de Pacientes Hemofílicos</h2>
      <p>Bem-vindo ao sistema de gestão de pacientes hemofílicos em Cabo Verde</p>

      <div className='auth-options'>
        <Link to='/login' className='btn btn-primary'>Login</Link>
        <Link to='/register' className='btn btn-secondary'>Registrar</Link>
      </div>
    </div>
  )
}

export default Home;
