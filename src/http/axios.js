import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Ensures cookies and credentials are sent
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token to every request if available
// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

api.interceptors.response.use(
  (response) => {
    console.log("axios response:", response)
    return response.data
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized response, e.g., logout or redirect
      // Example: localStorage.removeItem('token');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
