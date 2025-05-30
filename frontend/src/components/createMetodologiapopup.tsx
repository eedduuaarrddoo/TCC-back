import React, { useState } from "react";
import "../css/menu_admin.css"; // ajuste o caminho se necessário

interface MetodologiaCreatePopupProps {
  onClose: () => void;
  onSubmitSuccess: () => void;
  onCreateMetodologia: (formData: FormData) => Promise<void>;
}

const MetodologiaCreatePopup: React.FC<MetodologiaCreatePopupProps> = ({
  onClose,
  onSubmitSuccess,
  onCreateMetodologia,
}) => {
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("");
  const [metodos, setMetodos] = useState("");
  const [referencias, setReferencias] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("material", material);
    formData.append("metodos", metodos);
    formData.append("referencias", referencias);

    try {
      await onCreateMetodologia(formData);
      alert("Metodologia cadastrada com sucesso!");
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar metodologia:", error);
      alert("Erro ao cadastrar metodologia.");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Cadastrar Metodologia</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <textarea
            placeholder="Material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            required
          />
          <textarea
            placeholder="Métodos"
            value={metodos}
            onChange={(e) => setMetodos(e.target.value)}
            required
          />
          <textarea
            placeholder="Referências"
            value={referencias}
            onChange={(e) => setReferencias(e.target.value)}
            required
          />
          <div className="btn-container">
            <button type="submit" className="btn-green">Cadastrar</button>
            <button type="button" className="btn-red" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetodologiaCreatePopup;
