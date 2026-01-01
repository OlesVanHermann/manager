import { useState } from "react";
interface Props { serviceName: string; cronId: number; isOpen: boolean; onClose: () => void; onSuccess: () => void; }
export function EditCronModal({ serviceName, cronId, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  const handleSave = async () => { console.log('[Modal:EditCron] Action: modifier', { serviceName, cronId }); setLoading(true); try { await new Promise(r => setTimeout(r, 500)); onSuccess(); } catch {} finally { setLoading(false); } };
  return (
    <div className="modal-overlay" onClick={onClose}><div className="modal-container" onClick={e => e.stopPropagation()}>
      <div className="modal-header"><h2>Modifier la tâche cron</h2><button className="modal-close" onClick={onClose}>×</button></div>
      <div className="modal-body"><p>Modification cron #{cronId} - Fonctionnalité en cours.</p></div>
      <div className="modal-footer"><button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button><button className="wh-modal-btn-primary" onClick={handleSave} disabled={loading}>{loading ? "..." : "Enregistrer"}</button></div>
    </div></div>
  );
}
export default EditCronModal;
