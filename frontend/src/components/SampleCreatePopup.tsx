import { useEffect, useState } from "react";
import "../css/sampleform.css";
import { getAllMetodologias } from "../controllers/sampleController";

interface SampleCreatePopupProps {
  onClose: () => void;
  onSubmitSuccess?: () => void;
  onCreateSample: (formData: FormData) => Promise<void>;
}

const SampleCreatePopup = ({ onClose, onSubmitSuccess, onCreateSample }: SampleCreatePopupProps) => {
  const [location, setLocation] = useState("");
  const [ph, setPh] = useState("");
  const [depth, setDepth] = useState("");
  const [spacamento, setSpacamento] = useState("");
  const [espacamento2, setEspacamento2] = useState("");
  const [arvore, setArvore] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [observacao, setObservacao] = useState("");
  const [altura, setAltura] = useState("");
  const [profundidadeInfo, setProfundidadeInfo] = useState("");
  const [vertice, setVertice] = useState("");
  const [talhao, setTalhao] = useState("");
  const [parcela, setParcela] = useState("");
  const [tratamento, setTratamento] = useState("");
  const [identificacao, setIdentificacao] = useState("");
  const [ac, setAc] = useState("");
  const [anexo1, setAnexo1] = useState<File | null>(null);
  const [anexo2, setAnexo2] = useState<File | null>(null);

  const [metodologias, setMetodologias] = useState<{ id: number; nome: string }[]>([]);
  const [selectedMetodologia, setSelectedMetodologia] = useState("");

  useEffect(() => {
    async function fetchMetodologias() {
      const data = await getAllMetodologias();
      setMetodologias(data);
    }
    fetchMetodologias();
  }, []);

  const handleSubmit = async () => {
    const storedUserID = localStorage.getItem("user_id");
    if (!storedUserID) {
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    const formData = new FormData();
    formData.append("location", location);
    formData.append("ph", ph);
    formData.append("depth", depth);
    formData.append("spacamento", spacamento);
    formData.append("espacamento2", espacamento2);
    formData.append("arvore", arvore);
    formData.append("porcentagem", porcentagem);
    formData.append("observacao", observacao);
    formData.append("altura", altura);
    formData.append("profundidade_info", profundidadeInfo);
    formData.append("vertice", vertice);
    formData.append("talhao", talhao);
    formData.append("parcela", parcela);
    formData.append("tratamento", tratamento);
    formData.append("identificacao", identificacao);
    formData.append("ac", ac);
    formData.append("user_id", storedUserID); // se precisar enviar usuário

    if (anexo1) formData.append("anexo1", anexo1);
    if (anexo2) formData.append("anexo2", anexo2);

    if (selectedMetodologia) {
     
       formData.append("metodologia_id", selectedMetodologia);
    }

    try {
      await onCreateSample(formData);
      alert("Amostra cadastrada com sucesso!");
      onClose();
      onSubmitSuccess?.();
    } catch (error) {
      alert("Erro ao cadastrar amostra.");
      console.error(error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Cadastrar Amostra</h2>
        <input type="text" placeholder="Local" value={location} onChange={e => setLocation(e.target.value)} />
        <input type="number" placeholder="pH" value={ph} onChange={e => setPh(e.target.value)} />
        <input type="number" placeholder="Profundidade (cm)" value={depth} onChange={e => setDepth(e.target.value)} />
        <input type="text" placeholder="Espaçamento" value={spacamento} onChange={e => setSpacamento(e.target.value)} />
        <input type="text" placeholder="Espaçamento 2" value={espacamento2} onChange={e => setEspacamento2(e.target.value)} />
        <input type="text" placeholder="Árvore" value={arvore} onChange={e => setArvore(e.target.value)} />
        <input type="text" placeholder="Porcentagem" value={porcentagem} onChange={e => setPorcentagem(e.target.value)} />
        <input type="text" placeholder="Observação" value={observacao} onChange={e => setObservacao(e.target.value)} />
        <input type="text" placeholder="Altura" value={altura} onChange={e => setAltura(e.target.value)} />
        <input type="text" placeholder="Profundidade Info" value={profundidadeInfo} onChange={e => setProfundidadeInfo(e.target.value)} />
        <input type="text" placeholder="Vértice" value={vertice} onChange={e => setVertice(e.target.value)} />
        <input type="text" placeholder="Talhão" value={talhao} onChange={e => setTalhao(e.target.value)} />
        <input type="text" placeholder="Parcela" value={parcela} onChange={e => setParcela(e.target.value)} />
        <input type="text" placeholder="Tratamento" value={tratamento} onChange={e => setTratamento(e.target.value)} />
        <input type="text" placeholder="Identificação" value={identificacao} onChange={e => setIdentificacao(e.target.value)} />
        <input type="text" placeholder="AC" value={ac} onChange={e => setAc(e.target.value)} />

        <div>
          <label>Anexo 1:</label>
          <input type="file" onChange={e => setAnexo1(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label>Anexo 2:</label>
          <input type="file" onChange={e => setAnexo2(e.target.files?.[0] || null)} />
        </div>

        <select value={selectedMetodologia} onChange={e => setSelectedMetodologia(e.target.value)}>
          <option value="">Selecione a Metodologia</option>
          {metodologias.map((m) => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>

        <div className="btn-container">
          <button className="btn-blue" onClick={handleSubmit}>Cadastrar</button>
          <button className="btn-red" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default SampleCreatePopup;
