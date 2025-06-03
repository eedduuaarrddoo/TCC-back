import React from "react";
import { jsPDF } from "jspdf";
import { FileText, X } from "lucide-react";
import autoTable from "jspdf-autotable";
import api from "../services/api";

interface SampleDetailsProps {
  sample: {
    id: number;
    user: { id: number; username: string };
    location: string;
    ph: number;
    depth: number;
    created_at: string;
    updated_at?: string;
    metodologia: { id: number; nome: string };
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
    anexo1?: string; // não usamos aqui, pois o ZIP virá do backend
    anexo2?: string;
  };
  onClose: () => void;
}

const SampleDetailsModal: React.FC<SampleDetailsProps> = ({ sample, onClose }) => {
  // Monta array de campos para exibição
  const campos = [
    { label: "ID", value: sample.id },
    { label: "Usuário", value: `${sample.user.username} (ID: ${sample.user.id})` },
    { label: "Localização", value: sample.location },
    { label: "pH", value: sample.ph },
    { label: "Profundidade", value: `${sample.depth} cm` },
    { label: "Espaçamento", value: sample.espacamento },
    { label: "Espaçamento 2", value: sample.espacamento2 },
    { label: "Árvore", value: sample.arvore },
    { label: "Porcentagem", value: sample.porcentagem },
    { label: "Observação", value: sample.observacao },
    { label: "Altura", value: sample.altura },
    { label: "Profundidade Info", value: sample.profundidade_info },
    { label: "Vértice", value: sample.vertice },
    { label: "Talhão", value: sample.talhao },
    { label: "Parcela", value: sample.parcela },
    { label: "Tratamento", value: sample.tratamento },
    { label: "Identificação", value: sample.identificacao },
    { label: "AC", value: sample.ac },
    {
      label: "Data de Criação",
      value: new Date(sample.created_at).toLocaleDateString("pt-BR"),
    },
    {
      label: "Última Atualização",
      value: sample.updated_at
        ? new Date(sample.updated_at).toLocaleDateString("pt-BR")
        : undefined,
    },
    {
      label: "Metodologia",
      value: sample.metodologia
        ? `${sample.metodologia.nome} (ID: ${sample.metodologia.id})`
        : "Sem metodologia",
    },
  ];

  // Remove campos sem valor
  const camposVisiveis = campos.filter(
    (campo) => campo.value !== null && campo.value !== undefined && campo.value !== ""
  );

  // Função que chama a API para baixar o ZIP de anexos como Blob
  const downloadAttachmentsZip = async (sampleId: number) => {
    try {
      const response = await api.get(`/sample/${sampleId}/attachments/`, {
        responseType: "blob", // importante: diz que esperamos um Blob (ZIP)
      });
      // response.data é um Blob contendo o ZIP
      return response.data as Blob;
    } catch (error: any) {
      console.error("Erro ao baixar ZIP de anexos:", error.response?.data || error);
      throw new Error("Erro ao baixar anexos da amostra.");
    }
  };

  const handleGeneratePDF = async () => {
    // 1) Gera o PDF em memória
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Relatório da Amostra #${sample.id}`, 14, 20);

    // Transforma camposVisiveis em array de linhas para autoTable
    const rows = camposVisiveis.map((campo) => [campo.label, String(campo.value)]);

    autoTable(doc, {
      startY: 30,
      head: [["Campo", "Valor"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: "left" },
      bodyStyles: { halign: "left" },
    });

    // 2) Download do PDF
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const pdfLink = document.createElement("a");
    pdfLink.href = pdfUrl;
    pdfLink.download = `relatorio_amostra_${sample.id}.pdf`;
    document.body.appendChild(pdfLink);
    pdfLink.click();
    document.body.removeChild(pdfLink);
    URL.revokeObjectURL(pdfUrl);

    // 3) Depois que o PDF já foi disparado, solicita o ZIP de anexos
    try {
      const zipBlob = await downloadAttachmentsZip(sample.id);
      // Força o download do ZIP
      const zipUrl = URL.createObjectURL(zipBlob);
      const zipLink = document.createElement("a");
      zipLink.href = zipUrl;
      zipLink.download = `amostra_${sample.id}_anexos.zip`;
      document.body.appendChild(zipLink);
      zipLink.click();
      document.body.removeChild(zipLink);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      // Se ocorrer erro ao buscar o ZIP, podemos mostrar um alerta (opcional)
      alert("Erro ao baixar os anexos da amostra.");
    }
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
