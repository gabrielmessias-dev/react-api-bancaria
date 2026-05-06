import axios from "axios";

export const api = axios.create({
  // O navegador entende que é "mesmo servidor/api"
  baseURL: "/api", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);