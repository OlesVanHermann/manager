// ============================================================
// DIAGNOSTIC MODAL - Conforme OLD Manager
// Modal info pour badges A/AAAA DNS
// Source: old_manager/multisite/diagnostic/dialog.html
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface DiagnosticData {
  domain: string;
  recordType: "A" | "AAAA";
  currentIp: string | null;
  recommendedIp: string;
  isCorrect: boolean;
  isOvhZone: boolean;
  canChangeDns: boolean;
  contactAdmin?: string;
}

interface Props {
  serviceName: string;
  diagnostic: DiagnosticData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticModal({ serviceName, diagnostic, isOpen, onClose }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.multisite");

  if (!isOpen || !diagnostic) return null;

  const { domain, recordType, currentIp, recommendedIp, isCorrect, isOvhZone, canChangeDns, contactAdmin } = diagnostic;

  // Lien vers la modification de zone DNS
  const getDnsModifyLink = () => {
    const rootDomain = domain.split('.').slice(-2).join('.');
    return `/web-cloud/domain/${rootDomain}/zone`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{t("multisite.diagnostic.title", "Vérification des serveurs DNS")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {isCorrect ? (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <p>
                {t("multisite.diagnostic.correct", "L'enregistrement {{recordType}} est correctement configuré.", { recordType })}
              </p>
            </div>
          ) : (
            <>
              {/* Message principal */}
              <p className="diagnostic-message">
                {currentIp ? (
                  t("multisite.diagnostic.editRecord", 
                    "Modifiez le champ de type {{recordType}} avec l'adresse IP {{ip}} dans la zone DNS du domaine {{domain}}.",
                    { recordType, ip: recommendedIp, domain }
                  )
                ) : (
                  t("multisite.diagnostic.addRecord",
                    "Ajoutez un champ de type {{recordType}} avec l'adresse IP {{ip}} dans la zone DNS du domaine {{domain}}.",
                    { recordType, ip: recommendedIp, domain }
                  )
                )}
              </p>

              {/* Informations actuelles */}
              <div className="info-block">
                <dl className="info-list">
                  <div className="info-row">
                    <dt>{t("multisite.diagnostic.recordType", "Type d'enregistrement")}</dt>
                    <dd><span className="badge info">{recordType}</span></dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("multisite.diagnostic.currentIp", "IP actuelle")}</dt>
                    <dd>
                      {currentIp ? (
                        <code className="text-warning">{currentIp}</code>
                      ) : (
                        <span className="text-muted">{t("multisite.diagnostic.notConfigured", "Non configuré")}</span>
                      )}
                    </dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("multisite.diagnostic.recommendedIp", "IP recommandée")}</dt>
                    <dd><code className="text-success">{recommendedIp}</code></dd>
                  </div>
                </dl>
              </div>

              {/* Actions possibles */}
              {isOvhZone && (
                <>
                  {canChangeDns ? (
                    <div className="diagnostic-action">
                      <a href={getDnsModifyLink()} className="btn btn-link">
                        {t("multisite.diagnostic.editRecordLink", "Modifier le champ de type {{recordType}}", { recordType })}
                        <span className="icon-arrow">→</span>
                      </a>
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      <span className="alert-icon">⚠️</span>
                      <p>
                        {t("multisite.diagnostic.otherNic", 
                          "La modification doit être effectuée par l'administrateur de la zone DNS : {{nic}}",
                          { nic: contactAdmin }
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}

              {!isOvhZone && (
                <div className="alert alert-info">
                  <span className="alert-icon">ℹ️</span>
                  <p>
                    {t("multisite.diagnostic.externalZone",
                      "La zone DNS de ce domaine n'est pas gérée par OVHcloud. Veuillez effectuer la modification auprès de votre fournisseur DNS."
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            {t("common.close", "Fermer")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticModal;
