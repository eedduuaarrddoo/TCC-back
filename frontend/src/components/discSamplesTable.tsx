import React, { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { getAllDiscoSamples } from "../controllers/sampleController";
import "../css/menu_admin.css";

export interface DiscoSampleData {
  id: number;
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



interface Props {
  onEdit: (disco: DiscoSampleData) => void;
  onView?: (disco: DiscoSampleData) => void;
  onDelete?: (id: number) => void;
}

const DiscoSampleTable: React.FC<Props> = ({ onEdit, onView, onDelete }) => {
  const [discos, setDiscos] = useState<DiscoSampleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDiscoSamples(); // ajuste conforme o nome correto no controller
        setDiscos(data);
      } catch (err) {
        setError("Falha ao carregar discos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  

  if (loading) return <p>Carregando discos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="disco-sample-table">
      <h2>Lista de Disco Samples</h2>
      <table>
        <thead>
           <tr>
    <th>ID</th>
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
      <td colSpan={8}>Nenhum disco encontrado.</td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  );
};

export default DiscoSampleTable;
