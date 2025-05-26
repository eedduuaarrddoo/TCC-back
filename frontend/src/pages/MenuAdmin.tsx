import { useEffect, useState } from "react";
import {
  getAllSamples,
  createSample,
  deleteSample,
  updateSample,
  getAllUsers,
  deleteUser,
  editUser,
  getSampleDetails,
  getUserSamplesIds,
  searchSamplesByLocation
} from "../controllers/sampleController";
import SampleTable from "../components/SampleTable";
import UserTable from "../components/UserTable";
import "../css/menu_admin.css";
import SampleDetailsModal from "../components/SampleDetailsModal";
import SampleCreatePopup from "../components/SampleCreatePopup";
import SampleEditPopup from "../components/sampleEditModal";

const MenuAdmin = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showingUsers, setShowingUsers] = useState(false);
  const [samples, setSamples] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingSample, setEditingSample] = useState<any | null>(null);
  const [showUserEditPopup, setShowUserEditPopup] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userSamplesIds, setUserSamplesIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) setUserName(storedUserName);
    fetchSamples();
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

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    }
  };

  
   
     
  const handleDeleteSample = async (id: number) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir a amostra ${id}?`);
    if (!confirmar) return;

    try {
      await deleteSample([id]);
      alert("Amostra deletada com sucesso.");
      fetchSamples();
    } catch (error) {
      console.error("Erro ao deletar amostra", error);
      alert("Erro ao deletar a amostra.");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirmar) return;

    try {
      await deleteUser(id);
      alert("Usuário deletado com sucesso.");
      fetchUsers();
    } catch (error) {
      console.error("Erro ao deletar usuário", error);
      alert("Erro ao deletar o usuário.");
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


  const startEditUser = (user: any) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditIsAdmin(user.is_admin);
    setShowUserEditPopup(true);
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      await editUser(editingUser.id, {
        username: editUsername,
        email: editEmail,
        is_admin: editIsAdmin,
      });
      alert("Usuário atualizado com sucesso!");
      setShowUserEditPopup(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      alert("Erro ao atualizar o usuário.");
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

  const handleGetUserSamples = async (userId: number) => {
    try {
      const ids = await getUserSamplesIds(userId);
      setUserSamplesIds(ids);
      setSelectedUserId(userId);
    } catch (error) {
      console.error("Falha ao carregar amostras:", error);
      setUserSamplesIds([]);
    }
  };

const handleSearch = async () => {
  if (!searchTerm.trim()) {
    fetchSamples(); // se a busca estiver vazia, recarrega tudo
    return;
  }
  try {
    const resultados = await searchSamplesByLocation(searchTerm.trim());
    setSamples(resultados); // ou setSortedSamples se usar esse estado para exibição
  } catch (erro) {
    console.error("Erro ao buscar por localização:", erro);
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
              fetchSamples();
            }}
          >
            Ver Amostras
          </button>
          <button
            className="btn-purple"
            onClick={() => {
              setShowingUsers(true);
              fetchUsers();
            }}
          >
            Ver Usuários
          </button>
        </div>
      </div>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <input
      type="text"
      placeholder="Buscar por localização..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        width: "200px",
        marginRight: "8px",
      }}
    />
    <button
      onClick={handleSearch}
      style={{
        padding: "3px 3px",
        borderRadius: "4px",
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      🔍
    </button>
  </div>
      {showingUsers ? (
        <UserTable
          users={users}
          onEdit={startEditUser}
          onDelete={handleDeleteUser}
          onViewSamples={handleGetUserSamples}
          userSamplesIds={userSamplesIds}
          selectedUserId={selectedUserId}
          onSelectSample={handleSelectSample}
        />
      ) : (
        <>
          <SampleTable
            samples={sortedSamples}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={startEditSample}
            onDelete={handleDeleteSample}
            onView={handleViewSample}
          />
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

    {/* POPUP DE EDIÇÃO DE AMOSTRA */}
    {showEditPopup && editingSample && (
        <SampleEditPopup
          initialData={editingSample}
          onClose={() => setShowEditPopup(false)}
          onSubmit={handleEditSampleSubmit}
        />
      )}

    {/* POPUP DE EDIÇÃO DE USUÁRIO */}
    {showUserEditPopup && showingUsers && editingUser && (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Editar Usuário</h2>
          <input
            type="text"
            placeholder="Nome de Usuário"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={editIsAdmin}
              onChange={(e) => setEditIsAdmin(e.target.checked)}
            />
            Admin
          </label>
          <div className="btn-container">
            <button className="btn-green" onClick={handleEditUser}>
              Salvar Alterações
            </button>
            <button className="btn-red" onClick={() => setShowUserEditPopup(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
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
  </div>
);

};

export default MenuAdmin;