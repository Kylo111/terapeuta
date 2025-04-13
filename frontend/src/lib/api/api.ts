import axios from 'axios';

// Tworzymy instancję axios z domyślnymi ustawieniami
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor do dodawania tokenu autoryzacyjnego do żądań
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor do odświeżania tokenu w przypadku błędu 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Jeśli błąd 401 i nie jest to żądanie odświeżenia tokenu
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const deviceId = localStorage.getItem('deviceId');
        
        if (!refreshToken || !deviceId) {
          // Brak tokenu odświeżania lub deviceId - wylogowanie
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('deviceId');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }
        
        // Próba odświeżenia tokenu
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {
            refreshToken,
            deviceId,
          }
        );
        
        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Zapisanie nowych tokenów
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Ponowienie oryginalnego żądania z nowym tokenem
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Błąd odświeżania tokenu - wylogowanie
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('deviceId');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
