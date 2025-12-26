import { useState } from "react";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDomainModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const [domain, setDomain] = useState("");
  const [path, setPath] = useState("www");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/ovh/hosting/web/${serviceName}/attachedDomain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, path: `./${path}` }),
      });
      onSuccess();
      onClose();
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
          <h2>Ajouter un domaine</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Domaine</label>
            <input
              type="text"
              className="form-input"
              placeholder="exemple.com"
              value={domain}
              onChange={e => setDomain(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Dossier racine</label>
            <div className="input-group">
              <span className="input-prefix">./</span>
              <input
                type="text"
                className="form-input"
                placeholder="www"
                value={path}
                onChange={e => setPath(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="wh-modal-btn-secondary" onClick={onClose}>Annuler</button>
          <button className="wh-modal-btn-primary" onClick={handleAdd} disabled={loading || !domain.trim()}>
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDomainModal;
