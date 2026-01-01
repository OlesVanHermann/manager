import { useState } from "react";
interface Props { serviceName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function DeleteSslModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleDelete = async () => { console.log('[Modal:DeleteSsl] Action: supprimer', { serviceName }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Supprimer le certificat SSL</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Suppression SSL pour {serviceName} - Attention, action irréversible.</p></div><div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-danger" onClick={handleDelete} disabled={loading}>{loading ? "..." : "Supprimer"}</button></div></div></div>);
}
export default DeleteSslModal;
