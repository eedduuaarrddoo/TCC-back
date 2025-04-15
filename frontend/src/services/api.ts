import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Ajuste conforme necessário

const api = axios.create({
  baseURL: API_URL,
  //withCredentials: true, // Para suportar cookies de autenticação
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
