import { useState } from "react";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RestoreSnapshotModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRestore = async () => {
    setLoading(true);
    try {
      // TODO: Implémenter la restauration
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
          <h2>Restaurer un snapshot</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p>Restauration de {serviceName}</p>
          <p className="text-muted">Fonctionnalité en cours d'implémentation.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleRestore} disabled={loading}>
            {loading ? "Restauration..." : "Restaurer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestoreSnapshotModal;
