import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../controllers/authController";
import "../css/register.css";

const RegisterPage = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerUser({  email, password , username, is_admin: isAdmin });
      setSuccess("Cadastro realizado com sucesso!");
    } catch (err: any) {
      setError(err.message || "Erro no cadastro");
    }
  };

  return (
    
    <div className="page-container">
      <div className="form-container">
        <h2>Cadastro</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={username}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <label className="block mb-1 font-semibold">Tipo de Conta:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="accountType"
                  value="false"
                  checked={!isAdmin}
                  onChange={() => setIsAdmin(false)}
                />
                Usuário
              </label>
              <label>
                <input
                  type="radio"
                  name="accountType"
                  value="true"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(true)}
                />
                Admin
              </label>
            </div>
          </div>

          <button type="submit">Cadastrar</button>
        </form>

        <p>
          Já tem uma conta?{" "}
          <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  
  );
};

export default RegisterPage;
