import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/', // Adjust based on your env setup
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptors for request/response
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add tokens here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');

      // ✅ Only redirect if not already on /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
