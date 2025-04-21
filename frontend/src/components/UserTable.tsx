
import { Pencil, Trash2 } from "lucide-react";

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: number) => void;
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
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