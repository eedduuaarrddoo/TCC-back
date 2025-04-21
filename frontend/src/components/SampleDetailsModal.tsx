import { jsPDF } from 'jspdf';
import { Eye, FileText, X } from 'lucide-react';

interface SampleDetailsProps {
  sample: {
    id: number;
    user: any;
    location: string;
    ph: number;
    depth: number;
    created_at: string;
    atributo1?: string | null;
    atributo2?: number | null;
    atributo3?: number | null;
  };
  onClose: () => void;
}

const SampleDetailsModal: React.FC<SampleDetailsProps> = ({ sample, onClose }) => {
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Relatório da Amostra #${sample.id}`, 20, 20);
    
    doc.setFontSize(12);
    let yPosition = 40;
    
    const fields = [
      { label: 'ID do Usuário', value: sample.user.id },
      { label: 'Localização', value: sample.location },
      { label: 'pH', value: sample.ph },
      { label: 'Profundidade', value: `${sample.depth}m` },
      { label: 'Atributo 1', value: sample.atributo1 || '-' },
      { label: 'Atributo 2', value: sample.atributo2?.toString() || '-' },
      { label: 'Atributo 3', value: sample.atributo3?.toString() || '-' },
      { label: 'Data de Criação', value: new Date(sample.created_at).toLocaleDateString('pt-BR') },
    ];

    fields.forEach((field) => {
      doc.text(`${field.label}: ${field.value}`, 20, yPosition);
      yPosition += 10;
    });

    doc.save(`amostra_${sample.id}_relatorio.pdf`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Detalhes Completo da Amostra</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <label>ID:</label>
            <span>{sample.id}</span>
          </div>
          <div className="detail-row">
            <label>Usuário:</label>
            <span>{sample.user.username} (ID: {sample.user.id})</span>
          </div>
          <div className="detail-row">
            <label>Localização:</label>
            <span>{sample.location}</span>
          </div>
          <div className="detail-row">
            <label>pH:</label>
            <span>{sample.ph}</span>
          </div>
          <div className="detail-row">
            <label>Profundidade:</label>
            <span>{sample.depth}m</span>
          </div>
          <div className="detail-row">
            <label>Atributo 1:</label>
            <span>{sample.atributo1 || '-'}</span>
          </div>
          <div className="detail-row">
            <label>Atributo 2:</label>
            <span>{sample.atributo2?.toString() || '-'}</span>
          </div>
          <div className="detail-row">
            <label>Atributo 3:</label>
            <span>{sample.atributo3?.toString() || '-'}</span>
          </div>
          <div className="detail-row">
            <label>Data de Criação:</label>
            <span>{new Date(sample.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
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