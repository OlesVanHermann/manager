import { useState } from "react";
interface Props { serviceName: string; databaseName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function DeleteDatabaseModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleDelete = async () => { setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Supprimer la base de données</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Suppression de {databaseName} - Action irréversible.</p></div><div className="modal-footer"><button className="btn btn-secondary" onClick={onClose}>Annuler</button><button className="btn btn-danger" onClick={handleDelete} disabled={loading}>{loading ? "..." : "Supprimer"}</button></div></div></div>);
}
export default DeleteDatabaseModal;
