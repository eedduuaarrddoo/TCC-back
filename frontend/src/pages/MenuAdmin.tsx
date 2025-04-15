import { useEffect, useState } from "react";
import {
  getAllSamples,
  createSample,
  deleteSample,
  updateSample,
} from "../controllers/sampleController";
import "../css/menu_admin.css";
import { Pencil, Trash2 } from "lucide-react";

const MenuAdmin = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [samples, setSamples] = useState<any[]>([]);

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [ph, setPh] = useState("");
  const [depth, setDepth] = useState("");

  const [editingSample, setEditingSample] = useState<any | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const data = await getAllSamples();
      setSamples(data);
    } catch (error) {
      console.error("Erro ao carregar amostras", error);
    }
  };

  const handleCreateSample = async () => {
    const storedUserID = localStorage.getItem("user_id");
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
      setShowPopup(false);
      fetchSamples();
    } catch (error) {
      alert("Erro ao cadastrar amostra.");
    }
  };

  const handleDeleteSample = async (id: number) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir a amostra ${id}?`
    );
    if (!confirmar) return;

    try {
      await deleteSample([id]);
      alert("Amostra deletada com sucesso.");
      fetchSamples();
    } catch (error) {
      console.error("Erro ao deletar amostra", error);
      alert("Erro ao deletar a amostra.");
    }
  };

  const startEditSample = (sample: any) => {
    setEditingSample(sample);
    setLocation(sample.location);
    setPh(sample.ph.toString());
    setDepth(sample.depth.toString());
    setDate(sample.created_at.slice(0, 10));
    setShowEditPopup(true);
  };

  const handleEditSample = async () => {
    if (!editingSample) return;

    try {
      await updateSample(editingSample.id, {
        location,
        ph: parseFloat(ph),
        depth: parseFloat(depth),
      });

      alert("Amostra atualizada com sucesso!");
      setShowEditPopup(false);
      setEditingSample(null);
      fetchSamples();
    } catch (error) {
      alert("Erro ao atualizar a amostra.");
      console.error(error);
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
              <th>Ações</th>
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
                  <td>
                    {new Date(sample.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td>
                    <button
                      onClick={() => startEditSample(sample)}
                      className="btn-icon"
                      title="Editar Amostra"
                    >
                      <Pencil size={20} color="blue" />
                    </button>
                    <button
                      onClick={() => handleDeleteSample(sample.id)}
                      className="btn-icon"
                      title="Deletar Amostra"
                    >
                      <Trash2 size={20} color="red" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>Nenhuma amostra encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>

        <button className="btn-blue" onClick={() => setShowPopup(true)}>
          Cadastrar Amostra
        </button>
        <button className="btn-yellow">Imprimir</button>
        <button className="btn-green" onClick={fetchSamples}>
          Atualizar Lista
        </button>
      </div>

      {/* Popup de Cadastro */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Cadastrar Amostra</h2>

            <input
              type="text"
              placeholder="Local da Amostra"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="pH"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
            />
            <input
              type="number"
              placeholder="Profundidade"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />

            <div className="btn-container">
              <button className="btn-blue" onClick={handleCreateSample}>
                Cadastrar
              </button>
              <button className="btn-red" onClick={() => setShowPopup(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Edição */}
      {showEditPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Editar Amostra</h2>

            <input
              type="text"
              placeholder="Local da Amostra"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="pH"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
            />
            <input
              type="number"
              placeholder="Profundidade"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />

            <div className="btn-container">
              <button className="btn-green" onClick={handleEditSample}>
                Salvar Alterações
              </button>
              <button
                className="btn-red"
                onClick={() => setShowEditPopup(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuAdmin;
