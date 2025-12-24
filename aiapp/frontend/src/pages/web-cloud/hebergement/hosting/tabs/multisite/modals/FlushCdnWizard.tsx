// ============================================================
// FLUSH CDN WIZARD - Conforme OLD Manager
// Wizard avec options: all, extension, uri
// Source: old_manager/multisite/cdn-flush/cdn-flush.html
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  domain: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type PurgeType = "all" | "extension" | "uri";

interface PurgeOption {
  type: PurgeType;
  label: string;
  hint: string;
  pattern: string;
}

export function FlushCdnWizard({ serviceName, domain, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.multisite");
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedType, setSelectedType] = useState<PurgeType>("all");
  const [pattern, setPattern] = useState("");

  const purgeOptions: PurgeOption[] = [
    {
      type: "all",
      label: t("multisite.cdnFlush.optionAll", "Vider tout le cache"),
      hint: "",
      pattern: ""
    },
    {
      type: "extension",
      label: t("multisite.cdnFlush.optionExtension", "Vider par extension"),
      hint: ".css, .js, .png",
      pattern: ""
    },
    {
      type: "uri",
      label: t("multisite.cdnFlush.optionUri", "Vider une URI spécifique"),
      hint: "/images/logo.png",
      pattern: ""
    }
  ];

  const handleFlush = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Appel API pour vider le cache CDN
      await hostingService.flushDomainCdn(serviceName, domain, selectedType, pattern);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors du vidage du cache");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (selectedType === "all") return true;
    return pattern.trim().length > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wizard-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{t("multisite.cdnFlush.title", "Vider le cache CDN")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Breadcrumb */}
        <div className="wizard-breadcrumb">
          <span className={`wizard-step ${step >= 1 ? 'active' : ''}`}>1. Options</span>
          <span className="wizard-separator">→</span>
          <span className={`wizard-step ${step >= 2 ? 'active' : ''}`}>2. Confirmation</span>
        </div>

        {/* Content */}
        <div className="modal-body">
          {step === 1 && (
            <>
              <p className="wizard-description">
                {t("multisite.cdnFlush.description", "Choisissez le type de purge à effectuer pour le domaine.")}
              </p>

              {/* Domaine */}
              <div className="info-block compact">
                <label>{t("multisite.cdnFlush.domain", "Domaine")}</label>
                <p><strong>{domain}</strong></p>
              </div>

              {/* Options radio */}
              <div className="radio-group">
                {purgeOptions.map(option => (
                  <label key={option.type} className="radio-option">
                    <input
                      type="radio"
                      name="purgeType"
                      value={option.type}
                      checked={selectedType === option.type}
                      onChange={() => {
                        setSelectedType(option.type);
                        setPattern("");
                      }}
                    />
                    <span className="radio-label">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Champ pattern si extension ou uri */}
              {selectedType !== "all" && (
                <div className="form-group">
                  <label htmlFor="pattern">
                    {selectedType === "extension" 
                      ? t("multisite.cdnFlush.extensionLabel", "Extension(s)")
                      : t("multisite.cdnFlush.uriLabel", "URI")
                    }
                  </label>
                  <input
                    type="text"
                    id="pattern"
                    className="form-input"
                    placeholder={purgeOptions.find(o => o.type === selectedType)?.hint}
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                  />
                  <p className="form-hint">
                    {selectedType === "extension"
                      ? t("multisite.cdnFlush.extensionHint", "Séparez les extensions par des virgules")
                      : t("multisite.cdnFlush.uriHint", "Chemin relatif depuis la racine du domaine")
                    }
                  </p>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="wizard-description">
                {t("multisite.cdnFlush.confirmDescription", "Confirmez le vidage du cache CDN.")}
              </p>

              <div className="summary-block">
                <dl className="info-list">
                  <div className="info-row">
                    <dt>{t("multisite.domain", "Domaine")}</dt>
                    <dd><strong>{domain}</strong></dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("multisite.cdnFlush.purgeType", "Type de purge")}</dt>
                    <dd>{purgeOptions.find(o => o.type === selectedType)?.label}</dd>
                  </div>
                  {pattern && (
                    <div className="info-row">
                      <dt>{t("multisite.cdnFlush.pattern", "Motif")}</dt>
                      <dd><code>{pattern}</code></dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="alert alert-info">
                <span className="alert-icon">ℹ️</span>
                <p>{t("multisite.cdnFlush.warning", "Le vidage du cache peut prendre quelques minutes à se propager.")}</p>
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
            className="btn btn-secondary" 
            onClick={step === 1 ? onClose : () => setStep(1)}
            disabled={loading}
          >
            {step === 1 ? t("common.cancel", "Annuler") : t("common.back", "Retour")}
          </button>
          
          {step === 1 ? (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={() => setStep(2)}
              disabled={!canProceed()}
            >
              {t("common.next", "Suivant")}
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleFlush}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-small" /> Vidage...</>
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

export default FlushCdnWizard;
