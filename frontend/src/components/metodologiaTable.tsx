import React, { useEffect, useState } from "react";
import { Table2, Pencil, Trash2 } from "lucide-react";
import { getAllMetodologias, getSamplesByMetodologia } from "../controllers/sampleController";
import jsPDF from "jspdf";
//import autoTable from "jspdf-autotable";
import "../css/menu_admin.css";

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

interface Props {
  onEdit: (metodologia: MetodologiaData) => void;
  onView?: (metodologia: MetodologiaData) => void;
  onDelete?: (id: number) => void;
}

const MetodologiaList: React.FC<Props> = ({ onEdit, onView, onDelete }) => {
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

  if (loading) return <p>Carregando metodologias...</p>;
  if (error) return <p>{error}</p>;

const handleGeneratePdf = async (metodologia: MetodologiaData) => {
  try {
    const samples = await getSamplesByMetodologia(metodologia.id);

    if (!samples || samples.length === 0) {
      alert("Nenhuma amostra encontrada para essa metodologia.");
      return;
    }

    // 1. Obter todos os campos únicos existentes nas amostras
    const uniqueFields = new Set<string>();
    samples.forEach((sample: any) => {
      Object.keys(sample).forEach((key) => uniqueFields.add(key));
    });

    const columns = Array.from(uniqueFields);

    // 2. Montar os dados da tabela com todas as colunas possíveis
    const tableData = samples.map((sample: any) => {
      return columns.map((col) => {
        const value = sample[col];

        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }

        return value !== undefined && value !== null ? String(value) : "";
      });
    });

    // 3. Criar o PDF
    const doc = new jsPDF();
    doc.text(`Amostras da Metodologia: ${metodologia.nome}`, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }, // azul escuro
    });

    doc.save(`amostras_metodologia_${metodologia.id}.pdf`);
  } catch (err) {
    alert("Erro ao gerar PDF");
    console.error(err);
  }
};

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
                   
                    <button
                      onClick={() => onEdit(m)}
                      className="btn-icon"
                      title="Editar Metodologia"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => onDelete?.(m.id)}
                      className="btn-icon"
                      title="Deletar Metodologia"
                    >
                      <Trash2 size={20} />
                    </button>

                      <button
                         onClick={() => handleGeneratePdf(m)} 
                        className="btn-icon"
                        title="Ver Dados da Tabela"
                      >
                      <Table2 size={20} />
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
