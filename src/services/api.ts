import axios from "axios";

export const api = axios.create({
  // /api para facilitar as chamadas nos componentes
  baseURL: "https://sprint-api-bancaria-fordenter-csharp.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Garanta que o espaço após 'Bearer' existe. 
      // O uso do .set() é o padrão mais estável nas versões atuais do Axios.
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);