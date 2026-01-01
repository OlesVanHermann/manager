import { useState } from "react";
interface Props { serviceName: string; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function OrderSslModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleOrder = async () => { console.log('[Modal:OrderSsl] Action: commander', { serviceName }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (<div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}><div className="modal-header"><h2>Commander un certificat SSL</h2><button className="modal-close" onClick={onClose}>×</button></div><div className="modal-body"><p>Commande SSL pour {serviceName} - Fonctionnalité en cours.</p></div><div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleOrder} disabled={loading}>{loading ? "..." : "Commander"}</button></div></div></div>);
}
export default OrderSslModal;
