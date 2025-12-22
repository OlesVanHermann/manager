// ============================================================
// ADD DOMAIN MODAL - Ajouter un domaine attaché
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour ajouter un domaine ou sous-domaine. */
export function AddDomainModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domain, setDomain] = useState("");
  const [path, setPath] = useState("");
  const [ssl, setSsl] = useState(true);
  const [firewall, setFirewall] = useState(false);
  const [cdn, setCdn] = useState(false);
  const [ownLog, setOwnLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateDomain = (d: string) => {
    // Simple validation: no uppercase, reasonable length
    return d.length > 0 && d.length <= 253 && !/[A-Z\s]/.test(d);
  };

  const validatePath = (p: string) => {
    // No ".." sequences, alphanumeric + dots, slashes, underscores, hyphens
    return !p.includes('..') && /^[\w./-]*$/.test(p);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDomain(domain)) {
      setError("Domaine invalide. Utilisez des minuscules sans espaces.");
      return;
    }
    
    if (path && !validatePath(path)) {
      setError("Chemin invalide. Caractères autorisés: lettres, chiffres, /, -, _, .");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await hostingService.createAttachedDomain(serviceName, {
        domain: domain.trim().toLowerCase(),
        path: path.trim() || domain.trim().toLowerCase(),
        ssl,
        firewall: firewall ? "active" : "none",
        cdn: cdn ? "active" : "none",
        ownLog: ownLog ? domain.trim().toLowerCase() : undefined,
      });
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDomain("");
    setPath("");
    setSsl(true);
    setFirewall(false);
    setCdn(false);
    setOwnLog(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("multisite.addDomain")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <p>Ajoutez un domaine ou sous-domaine pour héberger un site supplémentaire.</p>
            </div>

            <div className="form-group">
              <label className="form-label required">Domaine</label>
              <input
                type="text"
                className="form-input font-mono"
                value={domain}
                onChange={(e) => setDomain(e.target.value.toLowerCase())}
                placeholder="www.example.com"
                required
              />
              <span className="form-hint">Domaine ou sous-domaine (ex: blog.monsite.fr)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Dossier racine</label>
              <input
                type="text"
                className="form-input font-mono"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder={domain || "www.example.com"}
              />
              <span className="form-hint">Laissez vide pour utiliser le nom de domaine</span>
            </div>

            <div className="form-group">
              <label className="form-label">Options</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={ssl}
                    onChange={(e) => setSsl(e.target.checked)}
                  />
                  Activer SSL (Let's Encrypt)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={firewall}
                    onChange={(e) => setFirewall(e.target.checked)}
                  />
                  Activer le firewall applicatif
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={cdn}
                    onChange={(e) => setCdn(e.target.checked)}
                  />
                  Activer le CDN
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={ownLog}
                    onChange={(e) => setOwnLog(e.target.checked)}
                  />
                  Logs séparés
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Ajout..." : "Ajouter le domaine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDomainModal;
