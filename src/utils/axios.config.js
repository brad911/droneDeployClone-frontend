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
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global errors (like 401 redirects)
    if (error.response?.status === 401) {
      // e.g., redirect to login
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
