import React, { useState, useEffect } from "react";
import "../css/menu_admin.css";
import { getAllMetodologias } from "../controllers/sampleController";

interface DiscoSampleCreatePopupProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  onCreateDiscoSample: (formData: FormData) => Promise<void>;
}

const DiscoSampleCreatePopup: React.FC<DiscoSampleCreatePopupProps> = ({
  onClose,
  onSubmitSuccess,
  onCreateDiscoSample,
}) => {
  const [parcelas, setParcelas] = useState("");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [porcentagem, setPorcentagem] = useState("");
  const [observacao, setObservacao] = useState("");
  const [metodologiaId, setMetodologiaId] = useState<number | "">("");

  const [metodologias, setMetodologias] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    async function fetchMetodologias() {
      const data = await getAllMetodologias();
      setMetodologias(data);
    }
    fetchMetodologias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("parcelas", parcelas);
    formData.append("quantidade", quantidade.toString());
    formData.append("porcentagem", porcentagem);
    formData.append("observacao", observacao);
    if (metodologiaId !== "") {
      formData.append("metodologia", metodologiaId.toString());
    }

    try {
      await onCreateDiscoSample(formData);
      alert("DiscoSample cadastrada com sucesso!");
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar DiscoSample:", error);
      alert("Erro ao cadastrar DiscoSample.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Cadastrar DiscoSample</h2>
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

          <select
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
          </select>

          <div className="btn-container">
            <button type="submit" className="btn-green">Cadastrar</button>
            <button type="button" className="btn-red" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscoSampleCreatePopup;
