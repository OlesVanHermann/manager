import { useState } from "react";
interface Props { serviceName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function ActivateBoostModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleActivate = async () => { console.log('[Modal:ActivateBoost] Action: activer', { serviceName }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Activer le Boost</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Activation boost pour {serviceName} - Fonctionnalité en cours.</p></div><div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleActivate} disabled={loading}>{loading ? "..." : "Activer"}</button></div></div></div>);
}
export default ActivateBoostModal;
