// ============================================================
// EDIT PATH MODAL - Modifier le dossier racine
// ============================================================

import { useState, useEffect } from "react";
import { generalService } from "../GeneralTab.service";
import type { AttachedDomain } from "../../../hosting.types";

interface Props {
  serviceName: string;
  domain: AttachedDomain;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPathModal({ serviceName, domain, isOpen, onClose, onSuccess }: Props) {
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (domain && isOpen) {
      setPath(domain.path || "");
      setError(null);
    }
  }, [domain, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path || path.includes("..")) {
      setError("Chemin invalide");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await generalService.updateAttachedDomain(serviceName, domain.domain, { path });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Modifier le dossier racine</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            <p style={{ marginBottom: "16px", color: "#6B7280", fontSize: "13px" }}>
              Domaine: <strong>{domain.domain}</strong>
            </p>
            <div className="form-group">
              <label>Dossier racine *</label>
              <input type="text" value={path} onChange={(e) => setPath(e.target.value)} placeholder="./www" required style={{ fontFamily: "monospace" }} />
              <span className="form-hint">Chemin relatif depuis /home/{serviceName}/</span>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="wh-modal-btn-secondary" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="wh-modal-btn-primary" disabled={loading || !path}>{loading ? "..." : "Enregistrer"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPathModal;
