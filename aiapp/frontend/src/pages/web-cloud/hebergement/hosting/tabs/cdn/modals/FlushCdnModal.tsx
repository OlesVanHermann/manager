import { useState } from "react";
interface Props { serviceName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function FlushCdnModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleFlush = async () => { setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Vider le cache CDN</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Vidage cache CDN pour {serviceName} - Fonctionnalité en cours.</p></div><div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleFlush} disabled={loading}>{loading ? "..." : "Vider"}</button></div></div></div>);
}
export default FlushCdnModal;
