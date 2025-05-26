import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getAllMetodologias } from "../controllers/sampleController";

export interface MetodologiaData {
  id: number;
  nome: string;
  material: string;
  metodos: string;
  referencias: string;
  criado_em: string; // ISO date string
}

interface SortConfig {
  key: keyof MetodologiaData;
  direction: "asc" | "desc";
}

const MetodologiaList: React.FC = () => {
  const [metodologias, setMetodologias] = useState<MetodologiaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllMetodologias();
        setMetodologias(data);
      } catch (err: any) {
        setError("Falha ao carregar metodologias");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSort = (key: keyof MetodologiaData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sorted = [...metodologias].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setMetodologias(sorted);
  };

  const getArrow = (key: keyof MetodologiaData) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const onView = (m: MetodologiaData) => {
    // lógica para ver detalhes
    console.log("Ver detalhes:", m);
  };

  const onEdit = (m: MetodologiaData) => {
    // lógica para editar
    console.log("Editar:", m);
  };

  const onDelete = (id: number) => {
    // lógica para deletar
    console.log("Deletar ID:", id);
  };

  if (loading) return <p>Carregando metodologias...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="metodologia-list">
      <h2>Lista de Metodologias</h2>
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort("id")} style={{ cursor: "pointer" }}>
              ID {getArrow("id")}
            </th>
            <th onClick={() => onSort("nome")} style={{ cursor: "pointer" }}>
              Nome {getArrow("nome")}
            </th>
            <th>Material</th>
            <th>Métodos</th>
            <th>Referências</th>
            <th onClick={() => onSort("criado_em")} style={{ cursor: "pointer" }}>
              Criado em {getArrow("criado_em")}
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {metodologias.length > 0 ? (
            metodologias.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nome}</td>
                <td>{m.material}</td>
                <td>{m.metodos}</td>
                <td>{m.referencias}</td>
                <td>{new Date(m.criado_em).toLocaleString()}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => onView(m)} className="btn-icon" title="Ver Detalhes">
                      <Eye size={20} />
                    </button>
                    <button onClick={() => onEdit(m)} className="btn-icon" title="Editar Metodologia">
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => onDelete(m.id)} className="btn-icon" title="Deletar Metodologia">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Nenhuma metodologia encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MetodologiaList;
