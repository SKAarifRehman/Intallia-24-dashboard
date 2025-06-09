import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Set to `true` if cookies/session are required
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

//Attach token to every request
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Handle responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn('Unauthorized - redirecting to login');
      // Optional: Clear local/session storage or show toast
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (status >= 500) {
      console.error('Server error:', error.response?.data?.message || error.message);
      // Optionally use a notification system (like react-toastify)
    }

    return Promise.reject(error);
  }
);

export default api;
