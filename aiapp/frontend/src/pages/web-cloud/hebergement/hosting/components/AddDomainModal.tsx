// ============================================================
// MODAL: Ajouter un domaine multisite
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

type DomainType = "ovh" | "external";

/** Modal d'ajout de domaine multisite (OVH ou externe). */
export function AddDomainModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  // ---------- STATE ----------
  const [step, setStep] = useState(1);
  const [domainType, setDomainType] = useState<DomainType>("ovh");
  const [domain, setDomain] = useState("");
  const [path, setPath] = useState("/");
  const [ssl, setSsl] = useState(true);
  const [cdn, setCdn] = useState(false);
  const [firewall, setFirewall] = useState(false);
  const [wwwRedirect, setWwwRedirect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // ---------- HANDLERS ----------
  const handleClose = () => {
    setStep(1);
    setDomain("");
    setPath("/");
    setSsl(true);
    setCdn(false);
    setFirewall(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!domain.trim()) {
      setError(t("addDomain.errorDomainRequired"));
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await hostingService.addAttachedDomain(serviceName, {
        domain: domain.trim().toLowerCase(),
        path: path || "/",
        ssl,
        cdn: cdn ? "active" : "none",
        firewall: firewall ? "active" : "none",
      });
      if (wwwRedirect && !domain.startsWith("www.")) {
        try {
          await hostingService.addAttachedDomain(serviceName, {
            domain: `www.${domain.trim().toLowerCase()}`,
            path: path || "/",
            ssl,
            cdn: cdn ? "active" : "none",
            firewall: firewall ? "active" : "none",
          });
        } catch { /* ignore www errors */ }
      }
      onSuccess();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("addDomain.title")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          {step === 1 && (
            <div className="step-content">
              <p className="step-description">{t("addDomain.step1Desc")}</p>
              <div className="domain-type-selector">
                <button
                  className={`type-option ${domainType === "ovh" ? "active" : ""}`}
                  onClick={() => setDomainType("ovh")}
                >
                  <span className="type-icon">🌐</span>
                  <span className="type-label">{t("addDomain.typeOvh")}</span>
                  <span className="type-desc">{t("addDomain.typeOvhDesc")}</span>
                </button>
                <button
                  className={`type-option ${domainType === "external" ? "active" : ""}`}
                  onClick={() => setDomainType("external")}
                >
                  <span className="type-icon">🔗</span>
                  <span className="type-label">{t("addDomain.typeExternal")}</span>
                  <span className="type-desc">{t("addDomain.typeExternalDesc")}</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <div className="form-group">
                <label>{t("addDomain.domainLabel")}</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="exemple.com"
                  className="form-input"
                  autoFocus
                />
                {domainType === "external" && (
                  <span className="form-hint">{t("addDomain.externalHint")}</span>
                )}
              </div>
              <div className="form-group">
                <label>{t("addDomain.pathLabel")}</label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/"
                  className="form-input font-mono"
                />
                <span className="form-hint">{t("addDomain.pathHint")}</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <p className="step-description">{t("addDomain.step3Desc")}</p>
              <div className="options-list">
                <label className="option-item">
                  <input type="checkbox" checked={ssl} onChange={(e) => setSsl(e.target.checked)} />
                  <div className="option-text">
                    <span className="option-label">{t("addDomain.optionSsl")}</span>
                    <span className="option-desc">{t("addDomain.optionSslDesc")}</span>
                  </div>
                </label>
                <label className="option-item">
                  <input type="checkbox" checked={cdn} onChange={(e) => setCdn(e.target.checked)} />
                  <div className="option-text">
                    <span className="option-label">{t("addDomain.optionCdn")}</span>
                    <span className="option-desc">{t("addDomain.optionCdnDesc")}</span>
                  </div>
                </label>
                <label className="option-item">
                  <input type="checkbox" checked={firewall} onChange={(e) => setFirewall(e.target.checked)} />
                  <div className="option-text">
                    <span className="option-label">{t("addDomain.optionFirewall")}</span>
                    <span className="option-desc">{t("addDomain.optionFirewallDesc")}</span>
                  </div>
                </label>
                <label className="option-item">
                  <input type="checkbox" checked={wwwRedirect} onChange={(e) => setWwwRedirect(e.target.checked)} />
                  <div className="option-text">
                    <span className="option-label">{t("addDomain.optionWww")}</span>
                    <span className="option-desc">{t("addDomain.optionWwwDesc")}</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="step-indicator">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`step-dot ${step >= s ? "active" : ""}`} />
            ))}
          </div>
          <div className="modal-actions">
            {step > 1 && (
              <button className="btn btn-secondary" onClick={() => setStep(step - 1)} disabled={loading}>
                {t("addDomain.back")}
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                {t("addDomain.next")}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? t("addDomain.adding") : t("addDomain.confirm")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDomainModal;
