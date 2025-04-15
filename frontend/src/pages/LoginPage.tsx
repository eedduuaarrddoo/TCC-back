import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../controllers/loginController"; // Importando o controller
import "../css/login.css";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Para exibir erros de login
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email e senha são obrigatórios");
      return;
    }
    try {
      const data = { email, password };
      const response = await loginUser(data); // Chama o controller para login

      console.log("Login realizado:", response);
      localStorage.setItem("username", response.username);
      localStorage.setItem("user_id", response.user_id);
      localStorage.setItem("is_admin", response.isadm);

      // Verifica se o usuário é admin ou não
      if (response.isadm) {
        navigate("/menuadmin"); // Redireciona para o menu do admin
      } else {
        navigate("/menuusuario"); // Redireciona para o menu normal
      }
    } catch (error) {
      setError("Erro ao realizar login. Tente novamente.");
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
