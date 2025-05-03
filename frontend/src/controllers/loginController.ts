// src/controllers/loginController.ts
import api from "../services/api";

interface LoginData {
  email: string;
  password: string;
}

interface AuthResult {
  user_id: number;
  username: string;
  is_admin: boolean;
}

export const authenticateUser = async (data: LoginData): Promise<AuthResult> => {
  const response = await api.post("/login/", {
    email: data.email,
    password: data.password,
  });

  const { access, refresh, user_id, username, is_admin } = response.data;

  // Salva tokens no localStorage
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  // Salva dados do usuário (não sensíveis)
  localStorage.setItem("username", username);
  localStorage.setItem("is_admin", String(is_admin));
  localStorage.setItem("user_id", String(user_id));


  // Define o header Authorization global
  api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

  return { user_id, username, is_admin };
};
