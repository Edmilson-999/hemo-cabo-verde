import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'medico' 
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
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
        
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await register({
                name: formData.fullName,
                username: formData.userName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role
            });

            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Erro no registro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <h2>Sistema Hemofílicos Cabo Verde</h2>
                <h3>Criar Nova Conta</h3>
                
                {error && <div className="error-message">{error}</div>}
                {success && (
                    <div className="success-message">
                        Registro bem-sucedido! Redirecionando para login...
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                            <label>Nome de Usuário</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Telefone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirmar Senha</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tipo de Conta</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="medico">Médico</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Criar Conta'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
                    <p>© {new Date().getFullYear()} Associação de Hemofílicos de Cabo Verde</p>
                </div>
            </div>
        </div>
    );
}

export default Register;