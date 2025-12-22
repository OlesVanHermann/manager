// ============================================================
// MODAL: Edit Attached Domain
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  domain: AttachedDomain | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour modifier un domaine attaché (multisite). */
export function EditDomainModal({ serviceName, domain, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [path, setPath] = useState("");
  const [ssl, setSsl] = useState(false);
  const [cdn, setCdn] = useState("none");
  const [firewall, setFirewall] = useState("none");
  const [ownLog, setOwnLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- INIT ----------
  useEffect(() => {
    if (domain && isOpen) {
      setPath(domain.path || "");
      setSsl(domain.ssl || false);
      setCdn(domain.cdn || "none");
      setFirewall(domain.firewall || "none");
      setOwnLog(!!domain.ownLog);
    }
  }, [domain, isOpen]);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.updateAttachedDomain(serviceName, domain.domain, {
        path,
        ssl,
        cdn,
        firewall,
        ownLog: ownLog ? domain.domain : null
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !domain) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("multisite.editDomain")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <p className="modal-info">
            Modifier les paramètres de <strong>{domain.domain}</strong>
          </p>

          <div className="form-group">
            <label>{t("multisite.path")} *</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="www/"
            />
            <small className="field-hint">Dossier racine du site (relatif à /home/)</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ssl}
                  onChange={(e) => setSsl(e.target.checked)}
                />
                <span>{t("multisite.ssl")}</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={ownLog}
                  onChange={(e) => setOwnLog(e.target.checked)}
                />
                <span>{t("multisite.logseparate")}</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>{t("multisite.cdn")}</label>
            <select value={cdn} onChange={(e) => setCdn(e.target.value)}>
              <option value="none">Désactivé</option>
              <option value="active">Activé</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t("multisite.firewall")}</label>
            <select value={firewall} onChange={(e) => setFirewall(e.target.value)}>
              <option value="none">Désactivé</option>
              <option value="active">Activé</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDomainModal;
