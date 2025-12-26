import { useState } from "react";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OvhConfigModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      onSuccess();
    } catch (err) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configuration .ovhconfig</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Configuration PHP pour {serviceName}</p>
          <p className="text-muted">Fonctionnalité en cours d'implémentation.</p>
        </div>
        <div className="modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button>
          <button className="wh-modal-btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OvhConfigModal;
