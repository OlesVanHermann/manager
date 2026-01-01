import { useState } from "react";
interface Props { serviceName: string; domain: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function EditDomainModal({ serviceName, domain, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleSave = async () => { console.log('[Modal:EditDomain] Action: modifier', { serviceName, domain }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Modifier le domaine</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Modification de {domain} - Fonctionnalité en cours.</p></div><div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleSave} disabled={loading}>{loading ? "..." : "Enregistrer"}</button></div></div></div>);
}
export default EditDomainModal;
