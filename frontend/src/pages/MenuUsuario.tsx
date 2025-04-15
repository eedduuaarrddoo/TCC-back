import { useEffect, useState } from "react";
import { getAllSamples, createSample } from "../controllers/sampleController";
import "../css/menu_usuario.css";
const MenuUsuario = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [samples, setSamples] = useState<any[]>([]); // Estado para armazenar as amostras

  // Estados para armazenar os valores do formulário
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [ph, setPh] = useState("");
  const [depth, setDepth] = useState("");

  // Acessa o nome do usuário armazenado no localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    fetchSamples();
  }, []);

  // Função para buscar todas as amostras
  const fetchSamples = async () => {
    try {
      const data = await getAllSamples();
      setSamples(data);
    } catch (error) {
      console.error("Erro ao carregar amostras", error);
    }
  };

  // Função para cadastrar a amostra
  const handleCreateSample = async () => {
    const storedUserID = localStorage.getItem("user_id"); // Pegando o ID do usuário
    if (!storedUserID) {
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    try {
      await createSample({
        location,
        ph: parseFloat(ph),
        depth: parseFloat(depth),
        user_id: parseInt(storedUserID),
      });
      alert("Amostra cadastrada com sucesso!");
      setShowPopup(false); // Fecha o popup após cadastrar
      fetchSamples(); // Atualiza a lista de amostras
    } catch (error) {
      alert("Erro ao cadastrar amostra.");
    }
  };

  return (
    <div className="page-container">
    <div className="user-panel">
      <h2>Bem-vindo, {userName || "Usuário"}!</h2>

      <h3>Lista de Amostras</h3>
      <table className="sample-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID_usuario</th>
            <th>Local</th>
            <th>pH</th>
            <th>Profundidade</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {samples.length > 0 ? (
            samples.map((sample) => (
              <tr key={sample.id}>
                <td>{sample.id}</td>
                <td>{sample.user}</td>
                <td>{sample.location}</td>
                <td>{sample.ph}</td>
                <td>{sample.depth}m</td>
                <td>{new Date(sample.created_at).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Nenhuma amostra encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn-blue" onClick={() => setShowPopup(true)}>Cadastrar Amostra</button>
      <button className="btn-yellow">Imprimir</button>
      <button className="btn-green" onClick={fetchSamples}>Atualizar Lista</button>
    </div>

    {/* Popup */}
    {showPopup && (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Cadastrar Amostra</h2>

          <input type="text" placeholder="Local da Amostra" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="number" placeholder="pH" value={ph} onChange={(e) => setPh(e.target.value)} />
          <input type="number" placeholder="Profundidade" value={depth} onChange={(e) => setDepth(e.target.value)} />

          <div className="btn-container">
            <button className="btn-blue" onClick={handleCreateSample}>Cadastrar</button>
            <button className="btn-red" onClick={() => setShowPopup(false)}>Fechar</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default MenuUsuario;
