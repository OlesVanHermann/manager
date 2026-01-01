import { useState } from "react";
interface Props { serviceName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function DeactivateCdnModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleDeactivate = async () => { console.log('[Modal:DeactivateCdn] Action: désactiver', { serviceName }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Désactiver le CDN</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Désactivation CDN pour {serviceName}.</p></div><div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="btn btn-warning" onClick={handleDeactivate} disabled={loading}>{loading ? "..." : "Désactiver"}</button></div></div></div>);
}
export default DeactivateCdnModal;
