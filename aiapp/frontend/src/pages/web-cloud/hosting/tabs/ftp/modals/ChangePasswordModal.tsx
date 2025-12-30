import { useState } from "react";
import { ftpService } from "../FtpTab.service";

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
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = async () => {
    if (!password.trim() || password !== confirm) return;
    setLoading(true);
    setError("");
    try {
      await ftpService.changeFtpPassword(serviceName, login, password);
      onSuccess();
      onClose();
      setPassword(""); setConfirm("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ftp-modal-overlay" onClick={onClose}>
      <div className="ftp-modal" onClick={e => e.stopPropagation()}>
        <div className="ftp-modal-header">
          <h3>Changer le mot de passe</h3>
          <button className="ftp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ftp-modal-body">
          <p>Utilisateur : <strong>{login}</strong></p>
          <div className="ftp-form-group">
            <label className="ftp-form-label">Nouveau mot de passe</label>
            <input type="password" className="ftp-form-input" value={password} onChange={e => setPassword(e.target.value)} />
            <p className="ftp-form-hint">9-30 caractères, 1 chiffre, 1 minuscule, 1 majuscule</p>
          </div>
          <div className="ftp-form-group">
            <label className="ftp-form-label">Confirmer</label>
            <input type="password" className="ftp-form-input" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {password && confirm && password !== confirm && <p className="ftp-form-error">Les mots de passe ne correspondent pas</p>}
          {error && <p className="ftp-form-error">{error}</p>}
        </div>
        <div className="ftp-modal-footer">
          <button className="ftp-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="ftp-btn-confirm" onClick={handleChange} disabled={loading || !password.trim() || password !== confirm}>
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChangePasswordModal;
