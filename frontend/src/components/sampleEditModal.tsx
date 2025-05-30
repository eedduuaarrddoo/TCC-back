import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "../css/menu_admin.css";
import { getAllMetodologias } from "../controllers/sampleController";

interface Props {
  initialData: any;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

const SampleEditPopup: React.FC<Props> = ({ initialData, onClose, onSubmit }) => {
  const [formState, setFormState] = useState({
    location: "",
    ph: "",
    depth: "",
    espacamento: "",
    arvore: "",
    porcentagem: "",
    observacao: "",
    espacamento2: "",
    altura: "",
    profundidade_info: "",
    vertice: "",
    talhao: "",
    parcela: "",
    tratamento: "",
    identificacao: "",
    ac: "",
    metodologia: "",
    anexo1: null as File | null,
    anexo2: null as File | null,
  });

  const [metodologias, setMetodologias] = useState<any[]>([]);

  useEffect(() => {
    setFormState({
      location: initialData.location || "",
      ph: initialData.ph || "",
      depth: initialData.depth || "",
      espacamento: initialData.espacamento || "",
      arvore: initialData.arvore || "",
      porcentagem: initialData.porcentagem || "",
      observacao: initialData.observacao || "",
      espacamento2: initialData.espacamento2 || "",
      altura: initialData.altura || "",
      profundidade_info: initialData.profundidade_info || "",
      vertice: initialData.vertice || "",
      talhao: initialData.talhao || "",
      parcela: initialData.parcela || "",
      tratamento: initialData.tratamento || "",
      identificacao: initialData.identificacao || "",
      ac: initialData.ac || "",
      metodologia: initialData.metodologia?.id?.toString() || "",
      anexo1: null,
      anexo2: null,
    });
  }, [initialData]);

  useEffect(() => {
    async function fetchMetodologias() {
      const data = await getAllMetodologias();
      setMetodologias(data);
    }
    fetchMetodologias();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormState((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in formState) {
      const value = (formState as any)[key];
      if (value !== null) {
        formData.append(key, value);
      }
    }
    onSubmit(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Editar Amostra</h2>
        <form onSubmit={handleSubmit} className="sample-form">
          {Object.keys(formState).map((key) => {
            if (key === "anexo1" || key === "anexo2") {
              return (
                <div className="form-group" key={key}>
                  <label>{key}</label>
                  <input type="file" name={key} onChange={handleFileChange} />
                </div>
              );
            }

            if (key === "metodologia") {
              return (
                <div className="form-group" key={key}>
                  <label>Metodologia</label>
                  <select name="metodologia" value={formState.metodologia} onChange={handleChange}>
                    <option value="">Selecione uma metodologia</option>
                    {metodologias.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div className="form-group" key={key}>
                <label>{key}</label>
                <input
                  type={key === "ph" || key === "depth" ? "number" : "text"}
                  name={key}
                  value={(formState as any)[key]}
                  onChange={handleChange}
                />
              </div>
            );
          })}

          <div className="btn-container">
            <button type="submit" className="btn-green">
              Salvar
            </button>
            <button type="button" className="btn-red" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SampleEditPopup;
