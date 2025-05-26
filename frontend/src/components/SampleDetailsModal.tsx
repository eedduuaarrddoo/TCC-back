import { jsPDF } from 'jspdf';
import { FileText, X } from 'lucide-react';

interface SampleDetailsProps {
  sample: {
    id: number;
    user: { id: number; username: string };
    location: string;
    ph: number;
    depth: number;
    created_at: string;
    updated_at?: string;
    metodologia?: any;
    espacamento?: string;
    arvore?: string;
    porcentagem?: string;
    observacao?: string;
    espacamento2?: string;
    altura?: string;
    profundidade_info?: string;
    vertice?: string;
    talhao?: string;
    parcela?: string;
    tratamento?: string;
    identificacao?: string;
    ac?: string;
    anexo1?: string;
    anexo2?: string;
  };
  onClose: () => void;
}

const SampleDetailsModal: React.FC<SampleDetailsProps> = ({ sample, onClose }) => {
  const campos = [
    { label: 'ID', value: sample.id },
    { label: 'Usuário', value: `${sample.user.username} (ID: ${sample.user.id})` },
    { label: 'Localização', value: sample.location },
    { label: 'pH', value: sample.ph },
    { label: 'Profundidade', value: `${sample.depth} cm` },
    { label: 'Espaçamento', value: sample.espacamento },
    { label: 'Espaçamento 2', value: sample.espacamento2 },
    { label: 'Árvore', value: sample.arvore },
    { label: 'Porcentagem', value: sample.porcentagem },
    { label: 'Observação', value: sample.observacao },
    { label: 'Altura', value: sample.altura },
    { label: 'Profundidade Info', value: sample.profundidade_info },
    { label: 'Vértice', value: sample.vertice },
    { label: 'Talhão', value: sample.talhao },
    { label: 'Parcela', value: sample.parcela },
    { label: 'Tratamento', value: sample.tratamento },
    { label: 'Identificação', value: sample.identificacao },
    { label: 'AC', value: sample.ac },
    { label: 'Anexo 1', value: sample.anexo1 },
    { label: 'Anexo 2', value: sample.anexo2 },
    { label: 'Data de Criação', value: new Date(sample.created_at).toLocaleDateString('pt-BR') },
    { label: 'Última Atualização', value: sample.updated_at ? new Date(sample.updated_at).toLocaleDateString('pt-BR') : undefined },
    { label: 'Metodologia', value: sample.metodologia?.nome },
  ];

  const camposVisiveis = campos.filter(campo => campo.value !== null && campo.value !== undefined && campo.value !== "");

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Relatório da Amostra #${sample.id}`, 20, 20);

    doc.setFontSize(12);
    let y = 40;
    camposVisiveis.forEach((campo) => {
      doc.text(`${campo.label}: ${campo.value}`, 20, y);
      y += 10;
    });

    doc.save(`amostra_${sample.id}_relatorio.pdf`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Detalhes da Amostra</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {camposVisiveis.map((campo, index) => (
            <div className="detail-row" key={index}>
              <label>{campo.label}:</label>
              <span>{campo.value}</span>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-red" onClick={onClose}>
            Fechar
          </button>
          <button className="btn-green" onClick={handleGeneratePDF}>
            <FileText size={18} /> Gerar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleDetailsModal;
