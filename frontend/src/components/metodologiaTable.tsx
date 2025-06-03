import React, { useEffect, useState } from "react";
import { Table2, Pencil, Trash2 } from "lucide-react";
import { getAllMetodologias, getSamplesByMetodologia } from "../controllers/sampleController";
import jsPDF from "jspdf";
import "jspdf-autotable"; 
import "../css/menu_admin.css";
import autoTable from "jspdf-autotable";

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
    const response = await getSamplesByMetodologia(metodologia.id);
    const samples = response.samples || [];
    const discoSamples = response.discsamples || [];

    if (samples.length === 0 && discoSamples.length === 0) {
      alert("Nenhuma amostra ou disco sample encontrada para essa metodologia.");
      return;
    }

    const sampleAllFields = [
      "id",
      "user",
      "location",
      "ph",
      "depth",
      "espacamento",
      "arvore",
      "porcentagem",
      "observacao",
      "espacamento2",
      "altura",
      "profundidade_info",
      "vertice",
      "talhao",
      "parcela",
      "tratamento",
      "identificacao",
      "ac",
      "created_at",
      "updated_at",
    ];

    const sampleFieldLabels: Record<string, string> = {
      id: "ID",
      user: "Usuário",
      location: "Local",
      ph: "pH",
      depth: "Profundidade",
      espacamento: "Espaçamento",
      arvore: "Árvore",
      porcentagem: "Porcentagem",
      observacao: "Observação",
      espacamento2: "Espaçamento 2",
      altura: "Altura",
      profundidade_info: "Profundidade Info",
      vertice: "Vértice",
      talhao: "Talhão",
      parcela: "Parcela",
      tratamento: "Tratamento",
      identificacao: "Identificação",
      ac: "AC",
      created_at: "Criado em",
      updated_at: "Atualizado em",
    };

    const usedSampleFields = sampleAllFields.filter((field) =>
      samples.some((s: any) => {
        const value = field === "user" ? s.user?.username : s[field];
        return value !== null && value !== undefined && value !== "";
      })
    );

    const sampleHeaders = usedSampleFields.map(
      (field) => sampleFieldLabels[field] || field
    );

    const sampleBody = samples.map((s: any) =>
      usedSampleFields.map((field) => {
        if (field === "user") return s.user?.username || "";
        const val = s[field];
        return val !== null && val !== undefined ? String(val) : "";
      })
    );

    // --- DiscoSample ---
    const discoAllFields = [
      "id",
      "parcelas",
      "quantidade",
      "porcentagem",
      "observacao",
      "metodologia",
      "criado_em",
    ];

    const discoFieldLabels: Record<string, string> = {
      id: "ID",
      parcelas: "Parcelas",
      quantidade: "Quantidade",
      porcentagem: "Porcentagem",
      observacao: "Observação",
      metodologia: "Metodologia",
      criado_em: "Criado em",
    };

    const usedDiscoFields = discoAllFields.filter((field) =>
      discoSamples.some((d: any) => {
        if (field === "metodologia") {
          return d.metodologia?.nome;
        }
        return d[field] !== null && d[field] !== undefined && d[field] !== "";
      })
    );

    const discoHeaders = usedDiscoFields.map(
      (field) => discoFieldLabels[field] || field
    );

    const discoBody = discoSamples.map((d: any) =>
      usedDiscoFields.map((field) => {
        if (field === "metodologia") return d.metodologia?.nome || "";
        const val = d[field];
        return val !== null && val !== undefined ? String(val) : "";
      })
    );

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(12);
    doc.text(
      `Amostras da Metodologia: ${metodologia.nome}`,
      14,
      15
    );

    const pageWidth = doc.internal.pageSize.getWidth() - 28;
    const sampleColumnWidth = pageWidth / usedSampleFields.length;

    // Desenha a tabela de Samples
    autoTable(doc, {
      startY: 20,
      head: [sampleHeaders],
      body: sampleBody,
      theme: "grid",
      styles: {
        fontSize: 6,
        halign: "center",
        valign: "middle",
        cellPadding: 1,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: usedSampleFields.reduce((acc, _, i) => {
        acc[i] = { cellWidth: sampleColumnWidth };
        return acc;
      }, {} as Record<number, { cellWidth: number }>),
    });

    // Usa o finalY da última tabela (Samples)
    const sampleFinalY = doc.lastAutoTable?.finalY ?? 20;

    // Se existir DiscoSamples, desenha abaixo
    if (discoSamples.length > 0) {
      const nextY = sampleFinalY + 10;
      doc.text(
        `DiscoSamples da Metodologia: ${metodologia.nome}`,
        14,
        nextY - 2
      );

      const discoColumnWidth = pageWidth / usedDiscoFields.length;
      autoTable(doc, {
        startY: nextY,
        head: [discoHeaders],
        body: discoBody,
        theme: "grid",
        styles: {
          fontSize: 6,
          halign: "center",
          valign: "middle",
          cellPadding: 1,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: usedDiscoFields.reduce((acc, _, i) => {
          acc[i] = { cellWidth: discoColumnWidth };
          return acc;
        }, {} as Record<number, { cellWidth: number }>),
      });
    }

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
