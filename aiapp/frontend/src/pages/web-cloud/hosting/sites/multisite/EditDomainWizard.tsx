// ============================================================
// EDIT DOMAIN WIZARD - Conforme OLD Manager
// Wizard 2 étapes avec toutes les options
// Source: old_manager/multisite/update/hosting-multisite-update.html
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { multisiteService } from "./MultisiteTab.service";
import type { AttachedDomain } from "../../hosting.types";

interface Props {
  serviceName: string;
  domain: AttachedDomain;
  hasCdn: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditDomainWizard({ serviceName, domain, hasCdn, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.multisite");
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [path, setPath] = useState(domain.path || "");
  const [ssl, setSsl] = useState(!!domain.ssl);
  const [cdn, setCdn] = useState(domain.cdn === "ACTIVE" || domain.cdn === true);
  const [firewall, setFirewall] = useState(domain.firewall === "ACTIVE" || domain.firewall === true);
  const [ownLog, setOwnLog] = useState(!!domain.ownLog);
  const [ownLogDomain, setOwnLogDomain] = useState(typeof domain.ownLog === 'string' ? domain.ownLog : domain.domain);
  
  // Options pour www.domain
  const [wwwNeeded, setWwwNeeded] = useState(false);
  const [wwwExists, setWwwExists] = useState(false);
  
  // Domaines disponibles pour ownLog
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);

  // Reset form when domain changes
  useEffect(() => {
    if (domain && isOpen) {
      setPath(domain.path || "");
      setSsl(!!domain.ssl);
      setCdn(domain.cdn === "ACTIVE" || domain.cdn === true);
      setFirewall(domain.firewall === "ACTIVE" || domain.firewall === true);
      setOwnLog(!!domain.ownLog);
      setOwnLogDomain(typeof domain.ownLog === 'string' ? domain.ownLog : domain.domain);
      setStep(1);
      setError(null);
      
      // Charger les domaines pour ownLog
      loadAvailableDomains();
      checkWwwExists();
    }
  }, [domain, isOpen]);

  const loadAvailableDomains = async () => {
    try {
      const domains = await multisiteService.listAttachedDomains(serviceName);
      setAvailableDomains(domains);
    } catch (err) {
      console.error("Error loading domains:", err);
    }
  };

  const checkWwwExists = async () => {
    try {
      const domains = await multisiteService.listAttachedDomains(serviceName);
      const wwwDomain = domain.domain.startsWith('www.') 
        ? domain.domain.substring(4) 
        : `www.${domain.domain}`;
      setWwwExists(domains.includes(wwwDomain));
    } catch (err) {
      setWwwExists(false);
    }
  };

  const isPathValid = (p: string) => {
    // Validation du chemin (comme dans old_manager)
    if (!p) return true;
    return /^[a-zA-Z0-9._\-/]+$/.test(p);
  };

  const formatPath = (p: string) => {
    if (!p) return "./";
    if (p.startsWith("./") || p.startsWith("/")) return p;
    return `./${p}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedPath = formatPath(path);
      
      // Mettre à jour le domaine principal
      await multisiteService.updateAttachedDomain(serviceName, domain.domain, {
        path: formattedPath,
        ssl,
        cdn: cdn ? "ACTIVE" : "NONE",
        firewall: firewall ? "ACTIVE" : "NONE",
        ownLog: ownLog ? ownLogDomain : null,
      });
      
      // Si www demandé, mettre à jour aussi
      if (wwwNeeded && wwwExists) {
        const wwwDomain = domain.domain.startsWith('www.') 
          ? domain.domain.substring(4) 
          : `www.${domain.domain}`;
        
        await multisiteService.updateAttachedDomain(serviceName, wwwDomain, {
          path: formattedPath,
          ssl,
          cdn: cdn ? "ACTIVE" : "NONE",
          firewall: firewall ? "ACTIVE" : "NONE",
          ownLog: ownLog ? ownLogDomain : null,
        });
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wizard-modal large" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{t("multisite.edit.title", "Modifier le domaine")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Breadcrumb */}
        <div className="wizard-breadcrumb">
          <span className={`wizard-step ${step >= 1 ? 'active' : ''}`}>1. Configuration</span>
          <span className="wizard-separator">→</span>
          <span className={`wizard-step ${step >= 2 ? 'active' : ''}`}>2. Récapitulatif</span>
        </div>

        {/* Content */}
        <div className="modal-body">
          {step === 1 && (
            <>
              <p className="wizard-description">
                {t("multisite.edit.step1Description", "Modifiez les paramètres du domaine.")}
              </p>

              {/* Domaine (readonly) */}
              <div className="form-group">
                <label>{t("multisite.domain", "Domaine")}</label>
                <input
                  type="text"
                  className="form-input"
                  value={domain.domain}
                  disabled
                />
                {wwwExists && !domain.domain.startsWith('www.') && (
                  <div className="checkbox-inline">
                    <label>
                      <input
                        type="checkbox"
                        checked={wwwNeeded}
                        onChange={(e) => setWwwNeeded(e.target.checked)}
                      />
                      {t("multisite.edit.applyToWww", "Appliquer également à www.{{domain}}", { domain: domain.domain })}
                    </label>
                  </div>
                )}
              </div>

              {/* Dossier racine */}
              <div className="form-group">
                <label htmlFor="path">{t("multisite.path", "Dossier racine")}</label>
                <div className="input-group">
                  <span className="input-prefix">./</span>
                  <input
                    type="text"
                    id="path"
                    className={`form-input ${!isPathValid(path) ? 'error' : ''}`}
                    placeholder="www"
                    value={path.replace(/^\.\//, '')}
                    onChange={(e) => setPath(e.target.value)}
                  />
                </div>
                {!isPathValid(path) && (
                  <p className="form-error">{t("multisite.edit.pathInvalid", "Caractères non autorisés dans le chemin")}</p>
                )}
              </div>

              {/* Options */}
              <div className="form-group">
                <label>{t("multisite.edit.options", "Options")}</label>
                
                {/* SSL */}
                <div className="checkbox-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={ssl}
                      onChange={(e) => setSsl(e.target.checked)}
                    />
                    <span>{t("multisite.ssl", "SSL")}</span>
                    <span className="option-hint">{t("multisite.edit.sslHint", "Activer HTTPS pour ce domaine")}</span>
                  </label>
                </div>

                {/* CDN */}
                {hasCdn && (
                  <div className="checkbox-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={cdn}
                        onChange={(e) => setCdn(e.target.checked)}
                      />
                      <span>{t("multisite.cdn", "CDN")}</span>
                      <span className="option-hint">{t("multisite.edit.cdnHint", "Accélérer le chargement via le CDN")}</span>
                    </label>
                  </div>
                )}

                {/* Firewall */}
                <div className="checkbox-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={firewall}
                      onChange={(e) => setFirewall(e.target.checked)}
                    />
                    <span>{t("multisite.firewall", "Firewall")}</span>
                    <span className="option-hint">{t("multisite.edit.firewallHint", "Activer la protection applicative")}</span>
                  </label>
                </div>

                {/* Logs séparés */}
                <div className="checkbox-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={ownLog}
                      onChange={(e) => setOwnLog(e.target.checked)}
                    />
                    <span>{t("multisite.logseparate", "Logs séparés")}</span>
                    <span className="option-hint">{t("multisite.edit.ownLogHint", "Statistiques de visite séparées")}</span>
                  </label>
                </div>

                {/* Sélection domaine pour logs */}
                {ownLog && (
                  <div className="form-group nested">
                    <label htmlFor="ownLogDomain">{t("multisite.edit.ownLogDomain", "Domaine pour les logs")}</label>
                    <select
                      id="ownLogDomain"
                      className="form-select"
                      value={ownLogDomain}
                      onChange={(e) => setOwnLogDomain(e.target.value)}
                    >
                      {availableDomains.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="wizard-description">
                {t("multisite.edit.step2Description", "Vérifiez les modifications avant de valider.")}
              </p>

              <div className="summary-block">
                <dl className="info-list">
                  <div className="info-row">
                    <dt>{t("multisite.domain", "Domaine")}</dt>
                    <dd><strong>{domain.domain}</strong></dd>
                  </div>
                  {wwwNeeded && (
                    <div className="info-row">
                      <dt>{t("multisite.domain", "Domaine")}</dt>
                      <dd><strong>www.{domain.domain}</strong></dd>
                    </div>
                  )}
                  <div className="info-row">
                    <dt>{t("multisite.path", "Dossier racine")}</dt>
                    <dd><code>{formatPath(path)}</code></dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("multisite.ssl", "SSL")}</dt>
                    <dd>
                      <span className={`badge ${ssl ? 'success' : 'inactive'}`}>
                        {ssl ? t("common.enabled", "Activé") : t("common.disabled", "Désactivé")}
                      </span>
                    </dd>
                  </div>
                  {hasCdn && (
                    <div className="info-row">
                      <dt>{t("multisite.cdn", "CDN")}</dt>
                      <dd>
                        <span className={`badge ${cdn ? 'success' : 'inactive'}`}>
                          {cdn ? t("common.enabled", "Activé") : t("common.disabled", "Désactivé")}
                        </span>
                      </dd>
                    </div>
                  )}
                  <div className="info-row">
                    <dt>{t("multisite.firewall", "Firewall")}</dt>
                    <dd>
                      <span className={`badge ${firewall ? 'success' : 'inactive'}`}>
                        {firewall ? t("common.enabled", "Activé") : t("common.disabled", "Désactivé")}
                      </span>
                    </dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("multisite.logseparate", "Logs séparés")}</dt>
                    <dd>
                      {ownLog ? (
                        <span className="badge success">{ownLogDomain}</span>
                      ) : (
                        <span className="badge inactive">{t("common.disabled", "Désactivé")}</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  <p>{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="wh-modal-btn-secondary" 
            onClick={step === 1 ? onClose : () => setStep(1)}
            disabled={loading}
          >
            {step === 1 ? t("common.cancel", "Annuler") : t("common.back", "Retour")}
          </button>
          
          {step === 1 ? (
            <button 
              type="button" 
              className="wh-modal-btn-primary" 
              onClick={() => setStep(2)}
              disabled={!isPathValid(path)}
            >
              {t("common.next", "Suivant")}
            </button>
          ) : (
            <button 
              type="button" 
              className="wh-modal-btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-small" /> Modification...</>
              ) : (
                t("common.confirm", "Confirmer")
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditDomainWizard;
