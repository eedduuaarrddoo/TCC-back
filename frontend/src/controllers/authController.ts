import api from "../services/api";

interface RegisterData {
  email: string;
  password: string;
  username: string;
  is_admin: boolean;
}

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await api.post("/register/", data);
    return response.data; // Retorna os dados da API
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error.response?.data || error);
    throw error.response?.data || "Erro desconhecido";
  }
};
