import React, { useState, useEffect } from "react";
import "../css/menu_admin.css";

interface DiscoSample {
  id: number;
  parcelas: string;
  quantidade: number;
  porcentagem: string;
  observacao?: string;
  //metodologia: number;
}

interface Metodologia {
  id: number;
  nome: string;
}

interface DiscoSampleEditPopupProps {
  discoSample: DiscoSample;
  //metodologias: Metodologia[];
  onClose: () => void;
  onSubmitSuccess: () => void;
  onUpdateDiscoSample: (id: number, formData: FormData) => Promise<void>;
}

const DiscoSampleEditPopup: React.FC<DiscoSampleEditPopupProps> = ({
  discoSample,
  //metodologias,
  onClose,
  onSubmitSuccess,
  onUpdateDiscoSample,
}) => {
  const [parcelas, setParcelas] = useState(discoSample.parcelas);
  const [quantidade, setQuantidade] = useState(discoSample.quantidade);
  const [porcentagem, setPorcentagem] = useState(discoSample.porcentagem);
  const [observacao, setObservacao] = useState(discoSample.observacao || "");
  //const [metodologiaId, setMetodologiaId] = useState<number>(discoSample.metodologia);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("parcelas", parcelas);
    formData.append("quantidade", quantidade.toString());
    formData.append("porcentagem", porcentagem);
    formData.append("observacao", observacao);
    //formData.append("metodologia", metodologiaId.toString());

    try {
      await onUpdateDiscoSample(discoSample.id, formData);
      alert("DiscoSample atualizada com sucesso!");
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar DiscoSample:", error);
      alert("Erro ao atualizar DiscoSample.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Editar DiscoSample</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Parcelas"
            value={parcelas}
            onChange={(e) => setParcelas(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value))}
            required
          />
          <input
            type="text"
            placeholder="Porcentagem"
            value={porcentagem}
            onChange={(e) => setPorcentagem(e.target.value)}
            required
          />
          <textarea
            placeholder="Observação (opcional)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
         {/* <select
            value={metodologiaId}
            onChange={(e) => setMetodologiaId(Number(e.target.value))}
            required
          >
            <option value="">Selecione uma Metodologia</option>
            {metodologias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>*/ }
          <div className="btn-container">
            <button type="submit" className="btn-green">Salvar</button>
            <button type="button" className="btn-red" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscoSampleEditPopup;
