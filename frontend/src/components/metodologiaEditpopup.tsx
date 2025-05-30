import React, { useState } from "react";
import { MetodologiaData } from "./metodologiaTable";
//import "../css/popup.css";

interface Props {
  initialData: MetodologiaData;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const MetodologiaEditPopup: React.FC<Props> = ({ initialData, onClose, onSubmit }) => {
  const [nome, setNome] = useState(initialData.nome);
  const [material, setMaterial] = useState(initialData.material);
  const [metodos, setMetodos] = useState(initialData.metodos);
  const [referencias, setReferencias] = useState(initialData.referencias);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("material", material);
    formData.append("metodos", metodos);
    formData.append("referencias", referencias);
    onSubmit(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Editar Metodologia</h2>
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
            <button type="submit" className="btn-green">Salvar Alterações</button>
            <button type="button" className="btn-red" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetodologiaEditPopup;
