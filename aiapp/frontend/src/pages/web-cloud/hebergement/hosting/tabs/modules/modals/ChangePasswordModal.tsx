import { useState } from "react";

interface Props {
  serviceName: string;
  login: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangePasswordModal({ serviceName, login, isOpen, onClose, onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = async () => {
    if (!password.trim() || password !== confirm) return;
    setLoading(true);
    try {
      await fetch(`/api/ovh/hosting/web/${serviceName}/user/${login}/changePassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
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
    <div className="modules-modal-overlay" onClick={onClose}>
      <div className="modules-modal-container" onClick={e => e.stopPropagation()}>
        <div className="modules-modal-header">
          <h2>Changer le mot de passe</h2>
          <button className="modules-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modules-modal-body">
          <p>Utilisateur : <strong>{login}</strong></p>
          <div className="modules-form-group">
            <label>Nouveau mot de passe</label>
            <input type="password" className="modules-form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="modules-form-group">
            <label>Confirmer le mot de passe</label>
            <input type="password" className="modules-form-input" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {password && confirm && password !== confirm && (
            <p className="modules-form-error">Les mots de passe ne correspondent pas</p>
          )}
        </div>
        <div className="modules-modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button>
          <button className="wh-modal-btn-primary" onClick={handleChange} disabled={loading || !password.trim() || password !== confirm}>
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
