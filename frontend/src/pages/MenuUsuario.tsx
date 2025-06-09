import { useEffect, useState } from "react";
import {
  getAllSamples,
  createSample,
  deleteSample,
  updateSample,
  getSampleDetails,
  searchSamplesByLocation,
  getAllMetodologias,
  createMetodologia,
  updateMetodologia,
  getAllDiscoSamples,
  createDiscoSample,
  DiscoSampleData,
  updateDiscoSample,
  deleteDiscoSamples,
  deleteMetodologias,
  
} from "../controllers/sampleController";
import SampleTable from "../components/SampleTable";
import "../css/menu_admin.css";
import SampleDetailsModal from "../components/SampleDetailsModal";
import SampleCreatePopup from "../components/SampleCreatePopup";
import SampleEditPopup from "../components/sampleEditModal";
import MetodologiaList, { MetodologiaData } from "../components/metodologiaTable";
import MetodologiaCreatePopup from "../components/createMetodologiapopup";
import MetodologiaEditPopup from "../components/metodologiaEditpopup";
import DiscoSampleTable from "../components/discSamplesTable";
import DiscoSampleCreatePopup from "../components/createDiscSamplesModal";
import DiscoSampleEditPopup from "../components/editDiscSamplesmodal";


const MenuUsuario = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showingUsers, setShowingUsers] = useState(false);
  const [samples, setSamples] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingSample, setEditingSample] = useState<any | null>(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showingMetodologias, setShowingMetodologias] = useState(false);
  const [showCreateMetodologiaPopup, setShowCreateMetodologiaPopup] = useState(false);
  const [editingMetodologia, setEditingMetodologia] = useState<MetodologiaData | null>(null);
  const [showEditMetodologiaPopup, setShowEditMetodologiaPopup] = useState(false);
  const [showingDiscoSamples, setShowingDiscoSamples] = useState(false);
  const [discoSamples, setDiscoSamples] = useState<any[]>([]);
  const [showCreateDiscoSamplePopup, setShowCreateDiscoSamplePopup] = useState(false);
  const [showEditDiscoSamplePopup, setShowEditDiscoSamplePopup] = useState(false);
  const [editingDiscoSample, setEditingDiscoSample] = useState<DiscoSampleData | null>(null);
  const [metodologiasList, setMetodologiasList] = useState<MetodologiaData[]>([]);


  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) setUserName(storedUserName);
    fetchSamples();
    fetchMetodologias();
  }, []);

  const fetchSamples = async () => {
    try {
      const data = await getAllSamples();
      setSamples(data);
      setSortConfig(null);
    } catch (error) {
      console.error("Erro ao carregar amostras", error);
    }
  };

  
  const fetchMetodologias = async () => {
  try {
    const data = await getAllMetodologias();
    setMetodologiasList(data); // Armazena na variável correta
  } catch (error) {
    console.error("Erro ao buscar metodologias", error);
  }
};

  const fetchDiscoSamples = async () => {
  try {
    const data = await getAllDiscoSamples();
    setDiscoSamples(data);
  } catch (error) {
    console.error("Erro ao carregar amostras de disco:", error);
  }
};
   
     
 const handleDeleteSample = async (id: number) => {
  const confirmar = window.confirm(`Tem certeza que deseja excluir a amostra ${id}?`);
  if (!confirmar) return;

  try {
    // Passa só o id, pois a URL já carrega o valor
    await deleteSample(id);
    alert("Amostra deletada com sucesso.");
    fetchSamples();
  } catch (error) {
    console.error("Erro ao deletar amostra", error);
    alert("Erro ao deletar a amostra.");
  }
};

  
   const startEditSample = (sample: any) => {
    setEditingSample(sample);
    setShowEditPopup(true);
  };

  const handleEditSampleSubmit = async (formData: FormData) => {
    if (!editingSample) return;
    try {
      await updateSample(editingSample.id, formData);
      alert("Amostra atualizada com sucesso!");
      setShowEditPopup(false);
      setEditingSample(null);
      fetchSamples();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar a amostra.");
    }
  };


  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSamples = [...samples];
  if (sortConfig !== null) {
    sortedSamples.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const handleViewSample = async (sample: any) => {
    try {
      const detailedSample = await getSampleDetails(sample.id);
      setSelectedSample(detailedSample);
      setShowDetailsPopup(true);
    } catch (error) {
      alert("Erro ao carregar detalhes da amostra");
      console.error(error);
    }
  };

  const handleSelectSample = async (sampleId: number) => {
    try {
      const detailedSample = await getSampleDetails(sampleId);
      setSelectedSample(detailedSample);
      setShowDetailsPopup(true);
    } catch (error) {
      alert("Erro ao carregar detalhes da amostra");
    }
  };


const startEditMetodologia = (metodologia: MetodologiaData) => {
  setEditingMetodologia(metodologia);
  setShowEditMetodologiaPopup(true);
};
const handleEditMetodologiaSubmit = async (formData: FormData) => {
  if (!editingMetodologia) return;

  try {
    await updateMetodologia(editingMetodologia.id, formData);
    alert("Metodologia atualizada com sucesso!");
    setShowEditMetodologiaPopup(false);
    setEditingMetodologia(null);
    fetchMetodologias();
  } catch (error) {
    console.error("Erro ao atualizar metodologia:", error);
    alert("Erro ao atualizar metodologia.");
  }
};

const startEditDiscoSample = (sample: DiscoSampleData) => {
  setEditingDiscoSample(sample);
  setShowEditDiscoSamplePopup(true);
  fetchMetodologias();  // se precisar do dropdown atualizado
};

const handleDeleteDiscoSample = async (id: number) => {
  const confirmar = window.confirm("Tem certeza que deseja excluir este disco?");
  if (!confirmar) return;

  try {
    await deleteDiscoSamples([id]);
    alert("Disco deletado com sucesso!");
    fetchDiscoSamples(); // atualiza a tabela
  } catch (error) {
    console.error("Erro ao deletar disco:", error);
    alert("Erro ao deletar o disco.");
  }
};

const handleDeleteMetodologia = async (id: number) => {
  const confirmar = window.confirm("Tem certeza que deseja excluir esta metodologia?");
  if (!confirmar) return;

  try {
    await deleteMetodologias([id]);
    alert("Metodologia deletada com sucesso!");
    fetchMetodologias(); // recarrega lista atualizada
  } catch (error) {
    console.error("Erro ao deletar metodologia:", error);
    alert("Erro ao deletar a metodologia.");
  }
};

const handleSearch = async (term: string, metodologiaId: string) => {
  try {
    // Se ambos estiverem vazios, carrega tudo
    if (!term && !metodologiaId) {
      fetchSamples();
      return;
    }

    // Usa a nova função de busca que envia ambos os parâmetros
    const resultados = await searchSamplesByLocation(term, metodologiaId);
    setSamples(resultados);
  } catch (erro) {
    console.error("Erro ao buscar amostras:", erro);
  }
};

  return (
  <div className="page-container">
    <div className="user-panel">
      <h2>Bem-vindo, {userName || "Usuário"}!</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>{showingUsers ? "Lista de Usuários" : "Lista de Amostras"}</h3>
        <div>
          <button
            className="btn-blue"
            onClick={() => {
              setShowingUsers(false);
              setShowingMetodologias(false);
              setShowingDiscoSamples(false);
              fetchSamples();
            }}
          >
            Ver Amostras
          </button>
          
          <button
    className="btn-orange"
    onClick={() => {
      setShowingDiscoSamples(false);
      setShowingUsers(false);
      setShowingMetodologias(true);
      fetchMetodologias ();
    }}
  >
    Ver Metodologias
  </button>
  <button
  className="btn-dark"
  onClick={() => {
    setShowingUsers(false);
    setShowingMetodologias(false);
    setShowingDiscoSamples(true);
    fetchDiscoSamples();
  }}
>
  Ver Amostras de Disco
</button>
        </div>
      </div>
  
      {showingMetodologias ? (
  <>
    <MetodologiaList 
    onEdit={startEditMetodologia} 
    onDelete={handleDeleteMetodologia}
    />
    <div className="btn-group">
      <button className="btn-blue" onClick={() => setShowCreateMetodologiaPopup(true)}>
        Cadastrar Metodologia
      </button>
    </div>
  </>
): showingDiscoSamples ? (
  <>
    <DiscoSampleTable
      onEdit={startEditDiscoSample}
      onDelete={handleDeleteDiscoSample}
    />
    <div className="btn-group">
      <button className="btn-blue"  onClick={() => {
    setShowCreateDiscoSamplePopup(true);
    fetchDiscoSamples();
    }}>
        Cadastrar Amostra de Disco
      </button>
      <button className="btn-green" onClick={fetchDiscoSamples}>
        Atualizar Lista
      </button>
    </div>
  </>
) : (
  <>
    <SampleTable
                    samples={sortedSamples}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onEdit={startEditSample}
                    onDelete={handleDeleteSample}
                    onView={handleViewSample}
                    onSearch={handleSearch} 
                    metodologias={metodologiasList}   />
          <div className="btn-group">
            <button className="btn-blue" onClick={() => setShowCreatePopup(true)}>
                      Cadastrar Amostra
            </button>
            <button className="btn-green" onClick={fetchSamples}>
              Atualizar Lista
          </button>
          </div>
        </>
      )}
    </div>

    {/* POPUP DE CADASTRO */}
    {showCreatePopup && (
  <SampleCreatePopup
    onClose={() => setShowCreatePopup(false)}
    onSubmitSuccess={fetchSamples}
    onCreateSample={async (formData) => {
      // Aqui você chamará `createSample` que você vai adaptar depois para aceitar FormData
      await createSample(formData); // você vai adaptar isso depois
    }}
  />
)}

{showCreateMetodologiaPopup && (
  <MetodologiaCreatePopup
    onClose={() => setShowCreateMetodologiaPopup(false)}
    onSubmitSuccess={fetchMetodologias}
    onCreateMetodologia={async (formData) => {
      await createMetodologia(formData);
    }}
  />
)}
    {/* POPUP DE EDIÇÃO DE AMOSTRA */}
    {showEditPopup && editingSample && (
        <SampleEditPopup
          initialData={editingSample}
          onClose={() => setShowEditPopup(false)}
          onSubmit={handleEditSampleSubmit}
        />
      )}

    
    {showEditMetodologiaPopup && editingMetodologia && (
  <MetodologiaEditPopup
    initialData={editingMetodologia}
    onClose={() => setShowEditMetodologiaPopup(false)}
    onSubmit={handleEditMetodologiaSubmit}
  />
)}
    {/* MODAL DE DETALHES */}
    {showDetailsPopup && selectedSample && (
      <SampleDetailsModal
        sample={selectedSample}
        onClose={() => {
          setShowDetailsPopup(false);
          setSelectedSample(null);
        }}
      />
    )}
    {showCreateDiscoSamplePopup && (
  <DiscoSampleCreatePopup
    onClose={() => setShowCreateDiscoSamplePopup(false)}
    onSubmitSuccess={fetchDiscoSamples}
    onCreateDiscoSample={async (formData) => {
      await createDiscoSample(formData);
    }}
    
  />
)}


{showEditDiscoSamplePopup && editingDiscoSample && (
  <DiscoSampleEditPopup
    discoSample={editingDiscoSample}
   
    onClose={() => {
      setShowEditDiscoSamplePopup(false);
      setEditingDiscoSample(null);
    }}
    onSubmitSuccess={() => {
      setShowEditDiscoSamplePopup(false);
      setEditingDiscoSample(null);
      fetchDiscoSamples();
    }}
    onUpdateDiscoSample={async (id, formData) => {
      await updateDiscoSample(id, formData);
    }}
  />
)}
  </div>
);

};
export default MenuUsuario;
