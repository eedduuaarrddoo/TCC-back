import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  try {
    const response = await axios.post("http://localhost:8000/api/login/", data);
    return response.data; 
  } catch (error: any) {
    console.error("Erro no login", error);
    throw error.response?.data || "Erro desconhecido";
  }
};
