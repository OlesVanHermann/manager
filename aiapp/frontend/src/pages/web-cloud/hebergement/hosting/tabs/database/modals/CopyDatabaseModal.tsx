import { useState } from "react";
interface Props { serviceName: string; databaseName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function CopyDatabaseModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleCopy = async () => { setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (
    <div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h2>Copier la base de données</h2><button className="modal-close" onClick={onClose}>×</button></div>
      <div className="modal-body"><p>Copier {databaseName} - Fonctionnalité en cours.</p></div>
      <div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleCopy} disabled={loading}>{loading ? "..." : "Copier"}</button></div>
    </div></div>
  );
}
export default CopyDatabaseModal;
