import { Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: number) => void;
  onViewSamples: (userId: number) => Promise<void>;
  userSamplesIds: number[];
  selectedUserId: number | null;
  onSelectSample: (sampleId: number) => void;
}

const UserTable = ({
  users,
  onEdit,
  onDelete,
  onViewSamples,
  userSamplesIds,
  selectedUserId,
  onSelectSample
}: UserTableProps) => {
  const [loading, setLoading] = useState(false);

  const handleViewSamples = async (userId: number) => {
    setLoading(true);
    try {
      await onViewSamples(userId);
    } catch (error) {
      console.error("Erro ao carregar amostras:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <table className="sample-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Senha</th>
          <th>Admin?</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>••••••••</td>
              <td>{user.is_admin ? "Sim" : "Não"}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => handleViewSamples(user.id)}
                    className="btn-icon"
                    title="Ver Amostras"
                    disabled={loading}
                  >
                    <Eye size={20} color="green" />
                  </button>
                  
                  {selectedUserId === user.id && (
                    <div className="samples-dropdown">
                      {loading ? (
                        <div>Carregando...</div>
                      ) : userSamplesIds.length > 0 ? (
                        userSamplesIds.map((sampleId) => (
                          <div
                            key={sampleId}
                            className="sample-item"
                            onClick={() => onSelectSample(sampleId)}
                          >
                            Amostra #{sampleId}
                          </div>
                        ))
                      ) : (
                        <div className="no-samples">Nenhuma amostra encontrada</div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => onEdit(user)} 
                    className="btn-icon" 
                    title="Editar Usuário"
                  >
                    <Pencil size={20} color="blue" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="btn-icon"
                    title="Deletar Usuário"
                  >
                    <Trash2 size={20} color="red" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>Nenhum usuário encontrado.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;