import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPatientItems = async (patientId) => {
  try {
    const response = await api.get(`/patient/${patientId}/items`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
};

export const addItem = async (patientId, itemData) => {
  try {
    const response = await api.post(`/patient/${patientId}/items`, itemData);
    return response.data;
  } catch (error) {
    console.log('Erro ao adicionar item:', error)
    throw error
  }
};

export const authService = {
    async login(email, password) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email && password) {
            resolve({
              token: 'simulated-jwt-token',
              user: {
                email,
                name: email.includes('admin') ? 'Administrador' : 'Médico',
                role: email.includes('admin') ? 'admin' : 'medico'
              }
            });
          } else {
            reject(new Error('Email e senha são obrigatórios'));
          }
        }, 1000);
      });
    },
  
    logout() {
      return Promise.resolve();
    }
};

export default api;