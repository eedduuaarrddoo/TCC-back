import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Cria instância do Axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true // Descomente se usar cookies HTTP-only
});

// Interceptador de requisição para adicionar o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    
    // Se o token existir, adiciona ao cabeçalho
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
       
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken
        });
        
        // Atualiza tokens no armazenamento local
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Atualiza o cabeçalho da requisição original
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        // Repete a requisição original com o novo token
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, limpa tokens e redireciona para login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;