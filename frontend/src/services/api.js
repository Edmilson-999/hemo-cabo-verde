import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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