import React from "react";

interface UserFormPopupProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const UserFormPopup: React.FC<UserFormPopupProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  isAdmin,
  setIsAdmin,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Editar Usuário</h2>
        <input
          type="text"
          placeholder="Nome de Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          Admin
        </label>
        <div className="btn-container">
          <button className="btn-green" onClick={onSubmit}>
            Salvar Alterações
          </button>
          <button className="btn-red" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserFormPopup;
