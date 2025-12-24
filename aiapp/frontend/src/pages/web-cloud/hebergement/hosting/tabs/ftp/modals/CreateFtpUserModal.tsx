import { useState } from "react";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateFtpUserModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [home, setHome] = useState("./");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!login.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/ovh/hosting/web/${serviceName}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password, home }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Créer un utilisateur FTP</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Login</label>
            <input type="text" className="form-input" value={login} onChange={e => setLogin(e.target.value)} placeholder="nouvel-utilisateur" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Répertoire home</label>
            <input type="text" className="form-input" value={home} onChange={e => setHome(e.target.value)} placeholder="./" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !login.trim() || !password.trim()}>
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFtpUserModal;
