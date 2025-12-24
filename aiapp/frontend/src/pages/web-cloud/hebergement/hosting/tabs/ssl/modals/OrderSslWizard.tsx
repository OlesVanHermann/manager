// ============================================================
// ORDER SSL MODAL - Conforme OLD Manager
// Modal pour commander/configurer un certificat SSL
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SslProvider = "letsencrypt" | "sectigo" | "import";

interface SslOption {
  value: SslProvider;
  label: string;
  description: string;
  price?: string;
}

export function OrderSslModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.ssl");
  
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<SslProvider>("letsencrypt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pour import custom
  const [certificate, setCertificate] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [chain, setChain] = useState("");

  const sslOptions: SslOption[] = [
    {
      value: "letsencrypt",
      label: "Let's Encrypt",
      description: t("general.ssl.letsencryptDesc", "Certificat gratuit, renouvelé automatiquement tous les 3 mois"),
      price: t("general.ssl.free", "Gratuit")
    },
    {
      value: "sectigo",
      label: "Sectigo DV",
      description: t("general.ssl.sectigoDesc", "Certificat payant avec validation de domaine, valide 1 an"),
      price: t("general.ssl.paid", "Payant")
    },
    {
      value: "import",
      label: t("general.ssl.import", "Importer un certificat"),
      description: t("general.ssl.importDesc", "Utilisez votre propre certificat SSL")
    }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (provider === "import") {
        if (!certificate.trim() || !privateKey.trim()) {
          setError(t("general.ssl.importRequired", "Le certificat et la clé privée sont requis"));
          setLoading(false);
          return;
        }
        await hostingService.orderSsl(serviceName, "import", certificate, privateKey, chain);
      } else {
        await hostingService.orderSsl(serviceName, provider);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t("common.error", "Une erreur est survenue"));
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (provider === "import") {
      return certificate.trim() && privateKey.trim();
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wizard-modal large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("general.ssl.orderTitle", "Commander un certificat SSL")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="wizard-breadcrumb">
          <span className={`wizard-step ${step >= 1 ? 'active' : ''}`}>1. {t("general.ssl.chooseType", "Type de certificat")}</span>
          <span className="wizard-separator">→</span>
          <span className={`wizard-step ${step >= 2 ? 'active' : ''}`}>2. {t("general.ssl.confirm", "Confirmation")}</span>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <>
              <p className="wizard-description">
                {t("general.ssl.chooseDescription", "Choisissez le type de certificat SSL à installer sur votre hébergement.")}
              </p>

              <div className="radio-group">
                {sslOptions.map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="sslProvider"
                      value={option.value}
                      checked={provider === option.value}
                      onChange={() => setProvider(option.value)}
                    />
                    <div className="radio-content">
                      <div className="radio-header">
                        <span className="radio-label">{option.label}</span>
                        {option.price && <span className="radio-price">{option.price}</span>}
                      </div>
                      <span className="radio-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>

              {provider === "import" && (
                <div className="import-fields">
                  <div className="form-group">
                    <label htmlFor="certificate">{t("general.ssl.certificate", "Certificat (PEM)")}</label>
                    <textarea
                      id="certificate"
                      className="form-textarea"
                      rows={6}
                      placeholder="-----BEGIN CERTIFICATE-----"
                      value={certificate}
                      onChange={(e) => setCertificate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="privateKey">{t("general.ssl.privateKey", "Clé privée (PEM)")}</label>
                    <textarea
                      id="privateKey"
                      className="form-textarea"
                      rows={6}
                      placeholder="-----BEGIN PRIVATE KEY-----"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="chain">{t("general.ssl.chain", "Chaîne de certification (optionnel)")}</label>
                    <textarea
                      id="chain"
                      className="form-textarea"
                      rows={4}
                      placeholder="-----BEGIN CERTIFICATE-----"
                      value={chain}
                      onChange={(e) => setChain(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="wizard-description">
                {t("general.ssl.confirmDescription", "Vérifiez les informations avant de valider.")}
              </p>

              <div className="summary-block">
                <dl className="info-list">
                  <div className="info-row">
                    <dt>{t("general.ssl.type", "Type de certificat")}</dt>
                    <dd><strong>{sslOptions.find(o => o.value === provider)?.label}</strong></dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("general.ssl.hosting", "Hébergement")}</dt>
                    <dd>{serviceName}</dd>
                  </div>
                </dl>
              </div>

              {provider === "letsencrypt" && (
                <div className="alert alert-info">
                  <span className="alert-icon">ℹ️</span>
                  <p>{t("general.ssl.letsencryptInfo", "Le certificat sera généré automatiquement et renouvelé tous les 3 mois.")}</p>
                </div>
              )}

              {provider === "sectigo" && (
                <div className="alert alert-warning">
                  <span className="alert-icon">⚠️</span>
                  <p>{t("general.ssl.sectigoInfo", "Vous serez redirigé vers le bon de commande pour finaliser l'achat.")}</p>
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  <p>{error}</p>
                </div>
              )}
            </>
          )}
        </div>

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
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <><span className="spinner-small" /> {t("common.processing", "Traitement...")}</> : t("common.confirm", "Confirmer")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderSslModal;
