// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../controllers/loginController";
import "../css/login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email e senha são obrigatórios");
      return;
    }

    try {
      const { is_admin } = await authenticateUser({ email, password });
      // redireciona conforme perfil
      navigate(is_admin ? "/menuadmin" : "/menuUsuario");
    } catch (err: any) {
      console.error(err);
      setError(err.error || "Credenciais inválidas ou problema de conexão");
      // limpa tokens num possível erro
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        <p className="login-footer">
          Não tem uma conta?{" "}
          <a href="/" className="login-link">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
