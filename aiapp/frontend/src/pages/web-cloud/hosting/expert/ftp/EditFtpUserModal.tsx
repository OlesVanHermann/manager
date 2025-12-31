import { useState, useEffect } from "react";
import { ftpService } from "./FtpTab.service";
import type { FtpUser } from "../../hosting.types";

interface Props {
  serviceName: string;
  user: FtpUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditFtpUserModal({ serviceName, user, isOpen, onClose, onSuccess }: Props) {
  const [home, setHome] = useState(user?.home || "");
  const [sshState, setSshState] = useState(user?.sshState || "none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) { setHome(user.home || ""); setSshState(user.sshState || "none"); }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await ftpService.updateFtpUser(serviceName, user.login, { home, sshState });
      onSuccess();
      onClose();
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
          <h3>Modifier l'utilisateur FTP</h3>
          <button className="ftp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ftp-modal-body">
          <p>Utilisateur : <strong>{user.login}</strong></p>
          <div className="ftp-form-group">
            <label className="ftp-form-label">Répertoire home</label>
            <input type="text" className="ftp-form-input" value={home} onChange={e => setHome(e.target.value)} />
          </div>
          <div className="ftp-form-group">
            <label className="ftp-form-label">Accès SSH</label>
            <select className="ftp-form-input" value={sshState} onChange={e => setSshState(e.target.value)}>
              <option value="none">Désactivé</option>
              <option value="sftponly">SFTP uniquement</option>
              <option value="active">SSH complet</option>
            </select>
          </div>
          {error && <p className="ftp-form-error">{error}</p>}
        </div>
        <div className="ftp-modal-footer">
          <button className="ftp-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="ftp-btn-confirm" onClick={handleSave} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default EditFtpUserModal;
