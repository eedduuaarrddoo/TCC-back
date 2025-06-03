import { Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";

interface Methodologia {
  id: number;
  nome: string;
}

interface Sample {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
  };
  location: string;
  ph: number;
  depth: number;
  created_at: string;
  atributo1?: string;
  atributo2?: number;
  atributo3?: number;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface Props {
  samples: Sample[];
  metodologias: Methodologia[]; 
  sortConfig: SortConfig | null;
  onSort: (key: string) => void;
  onEdit: (sample: Sample) => void;
  onDelete: (id: number) => void;
  onView: (sample: Sample) => void;
  onSearch: (term: string, metodologiaId: string) => void; // <-- modifiquei aqui
}

const SampleTable: React.FC<Props> = ({
  samples,
  metodologias,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onView,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethodology, setSelectedMethodology] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm.trim(), selectedMethodology);
  };

  const getArrow = (key: string) => {
    if (sortConfig?.key !== key) return "";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div >
      {/* Campo de busca e select de metodologia */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "8px" }}>
        <select
          value={selectedMethodology}
          onChange={(e) => setSelectedMethodology(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "220px",
          }}
        >
          <option value="">Nenhuma metodologia selecionada</option>
          {metodologias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por localização..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "3px 6px",
            borderRadius: "4px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔍
        </button>
      </div>

      {/* Tabela */}
       <div className="sample-table-container">
      <table className="sample-table">
        <thead>
          <tr>
            <th onClick={() => onSort("id")} style={{ cursor: "pointer" }}>
              ID {getArrow("id")}
            </th>
            <th onClick={() => onSort("user")} style={{ cursor: "pointer" }}>
              ID_Usuário {getArrow("user")}
            </th>
            <th onClick={() => onSort("location")} style={{ cursor: "pointer" }}>
              Local {getArrow("location")}
            </th>
            <th onClick={() => onSort("ph")} style={{ cursor: "pointer" }}>
              pH {getArrow("ph")}
            </th>
            <th onClick={() => onSort("depth")} style={{ cursor: "pointer" }}>
              Profundidade {getArrow("depth")}
            </th>
            <th onClick={() => onSort("created_at")} style={{ cursor: "pointer" }}>
              Criado em {getArrow("created_at")}
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {samples.length > 0 ? (
            samples.map((sample) => (
              <tr key={sample.id}>
                <td>{sample.id}</td>
                <td>{sample.user?.username}</td>
                <td>{sample.location}</td>
                <td>{sample.ph}</td>
                <td>{sample.depth}m</td>
                <td>{new Date(sample.created_at).toLocaleDateString("pt-BR")}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onView(sample)}
                      className="btn-icon"
                      title="Ver Detalhes"
                    >
                      <Eye size={20} color="green" />
                    </button>
                    <button
                      onClick={() => onEdit(sample)}
                      className="btn-icon"
                      title="Editar Amostra"
                    >
                      <Pencil size={20} color="blue" />
                    </button>
                    <button
                      onClick={() => onDelete(sample.id)}
                      className="btn-icon"
                      title="Deletar Amostra"
                    >
                      <Trash2 size={20} color="red" />
                    </button>
                  </div>
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
      </div>
    </div>
  );
};

export default SampleTable;
