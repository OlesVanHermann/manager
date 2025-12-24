import { useState } from "react";
import { ftpService } from "../FtpTab";

interface Props {
  serviceName: string;
  login: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedLogin: string) => void;
}

export function DeleteFtpUserModal({ serviceName, login, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !login) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await ftpService.deleteFtpUser(serviceName, login);
      onClose();
      onSuccess(login);  // Appeler onSuccess APRÈS onClose avec le login supprimé
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  return (
    <div className="ftp-modal-overlay" onClick={onClose}>
      <div className="ftp-modal" onClick={e => e.stopPropagation()}>
        <div className="ftp-modal-header">
          <h3>Supprimer l'utilisateur FTP</h3>
          <button className="ftp-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ftp-modal-body">
          <p>Voulez-vous vraiment supprimer <strong>{login}</strong> ?</p>
          <p className="ftp-modal-warning">⚠️ Cette action est irréversible.</p>
          {error && <p className="ftp-form-error">{error}</p>}
        </div>
        <div className="ftp-modal-footer">
          <button className="ftp-btn-cancel" onClick={onClose}>Annuler</button>
          <button className="ftp-btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteFtpUserModal;
