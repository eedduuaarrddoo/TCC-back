import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { getAllDiscoSamples, searchDiscoSamples, getAllMetodologias } from "../controllers/sampleController";
import "../css/menu_admin.css";

export interface DiscoSampleData {
  id: number;
  local?: string;
  parcelas: string;
  quantidade: number;
  porcentagem: string;
  observacao?: string;
  metodologia: {
    id: number;
    nome: string;
  };
  criado_em: string;
}

export interface MetodologiaData {
  id: number;
  nome: string;
}

interface Props {
  onEdit: (disco: DiscoSampleData) => void;
  onView?: (disco: DiscoSampleData) => void;
  onDelete?: (id: number) => void;
}

const DiscoSampleTable: React.FC<Props> = ({ onEdit, onView, onDelete }) => {
  const [discos, setDiscos] = useState<DiscoSampleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchLocal, setSearchLocal] = useState<string>("");
  const [selectedMetodologiaId, setSelectedMetodologiaId] = useState<number | "">("");
  const [metodologias, setMetodologias] = useState<MetodologiaData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDiscoSamples();
        setDiscos(data);
      } catch (err) {
        setError("Falha ao carregar discos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Buscar metodologias para o select
    const fetchMetodologias = async () => {
      const data = await getAllMetodologias();
      setMetodologias(data);
    };
    fetchMetodologias();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const localParam = searchLocal.trim() || undefined;
      const metodologiaParam = selectedMetodologiaId === "" ? undefined : Number(selectedMetodologiaId);
      const results = await searchDiscoSamples(localParam, metodologiaParam);
      setDiscos(results);
    } catch (err) {
      console.error("Erro ao buscar DiscoSamples:", err);
      setError("Erro ao buscar DiscoSamples.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando discos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="disco-sample-table user-panel">
      <h2>Lista de Disco Samples</h2>

      {/* Filtros de busca */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por Local..."
          value={searchLocal}
          onChange={(e) => setSearchLocal(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            flex: "1"
          }}
        />
        <select
          value={selectedMetodologiaId}
          onChange={(e) =>
            setSelectedMetodologiaId(e.target.value ? Number(e.target.value) : "")
          }
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px"
          }}
        >
          <option value="">Todas Metodologias</option>
          {metodologias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          title="Buscar"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="sample-table-container">
        <table className="sample-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Local</th>
              <th>Parcelas</th>
              <th>Quantidade</th>
              <th>Porcentagem</th>
              <th>Observação</th>
              <th>Metodologia</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {discos.length > 0 ? (
              discos.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.local || "-"}</td>
                  <td>{d.parcelas}</td>
                  <td>{d.quantidade}</td>
                  <td>{d.porcentagem}</td>
                  <td>{d.observacao || "-"}</td>
                  <td>{d.metodologia?.nome || "N/A"}</td>
                  <td>{new Date(d.criado_em).toLocaleString("pt-BR")}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(d)}
                        className="btn-icon"
                        title="Editar DiscoSample"
                      >
                        <Pencil size={20} color="blue" />
                      </button>
                      {onDelete && (
                        <button
                          onClick={() => onDelete(d.id)}
                          className="btn-icon"
                          title="Deletar DiscoSample"
                        >
                          <Trash2 size={20} color="red" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9}>Nenhum disco encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscoSampleTable;
