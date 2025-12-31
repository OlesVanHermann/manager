// ============================================================
// DELETE DOMAIN WIZARD - Conforme OLD Manager
// Wizard avec checkbox www + autoconfigure DNS
// Source: old_manager/multisite/delete/hosting-multisite-delete.html
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { multisiteService } from "./MultisiteTab.service";
import type { AttachedDomain } from "../../hosting.types";

interface Props {
  serviceName: string;
  domain: AttachedDomain;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteDomainWizard({ serviceName, domain, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.multisite");
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Options de suppression
  const [wwwNeeded, setWwwNeeded] = useState(false);
  const [autoconfigure, setAutoconfigure] = useState(true);
  const [wwwExists, setWwwExists] = useState(false);
  const [autoConfigureAvailable, setAutoConfigureAvailable] = useState(false);
  
  // Vérifier si www.domain existe et si autoconfigure est disponible
  useEffect(() => {
    if (!isOpen || !domain) return;
    
    const checkOptions = async () => {
      setChecking(true);
      try {
        // Vérifier si www.domain existe
        const domains = await multisiteService.listAttachedDomains(serviceName);
        const hasWww = domains.includes(`www.${domain.domain}`);
        setWwwExists(hasWww);
        
        // Vérifier si autoconfigure DNS est disponible
        // (zone DNS gérée par OVH)
        try {
          const rootDomain = domain.domain.split('.').slice(-2).join('.');
          const zones = await fetch(`/api/ovh/domain/zone`).then(r => r.json());
          setAutoConfigureAvailable(zones.includes(rootDomain));
          setAutoconfigure(zones.includes(rootDomain));
        } catch {
          setAutoConfigureAvailable(false);
          setAutoconfigure(false);
        }
      } catch (err) {
        console.error("Error checking options:", err);
      } finally {
        setChecking(false);
      }
    };
    
    checkOptions();
  }, [isOpen, domain, serviceName]);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Supprimer le domaine principal
      // bypassDNSConfiguration = !autoconfigure
      await multisiteService.deleteAttachedDomain(serviceName, domain.domain, !autoconfigure);
      
      // Si www demandé, supprimer aussi www.domain
      if (wwwNeeded && wwwExists) {
        await multisiteService.deleteAttachedDomain(serviceName, `www.${domain.domain}`, !autoconfigure);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container wizard-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{t("multisite.delete.title", "Supprimer un domaine")}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {checking ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Vérification des options...</p>
            </div>
          ) : (
            <>
              <p className="wizard-description">
                {t("multisite.delete.description", "Êtes-vous sûr de vouloir supprimer ce domaine de l'hébergement ?")}
              </p>

              {/* Informations du domaine */}
              <div className="info-block">
                <dl className="info-list">
                  <div className="info-row">
                    <dt>{t("multisite.domain", "Domaine")}</dt>
                    <dd><strong>{domain.domain}</strong></dd>
                  </div>
                  <div className="info-row">
                    <dt>{t("multisite.path", "Dossier racine")}</dt>
                    <dd><code>{domain.path || "./www"}</code></dd>
                  </div>
                </dl>
              </div>

              {/* Checkbox www.domain */}
              {wwwExists && (
                <div className="checkbox-option">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={wwwNeeded}
                      onChange={(e) => setWwwNeeded(e.target.checked)}
                    />
                    <span>
                      {t("multisite.delete.wwwOption", "Supprimer également")} <strong>www.{domain.domain}</strong>
                    </span>
                  </label>
                </div>
              )}

              {/* Checkbox autoconfigure DNS */}
              <div className={`checkbox-option thumbnail ${!autoConfigureAvailable ? 'disabled' : ''}`}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={autoconfigure}
                    onChange={(e) => setAutoconfigure(e.target.checked)}
                    disabled={!autoConfigureAvailable}
                  />
                  <span className="checkbox-text">
                    <strong>{t("multisite.delete.autoconfigureTitle", "Supprimer également les entrées DNS")}</strong>
                  </span>
                </label>
                <p className="checkbox-description">
                  {t("multisite.delete.autoconfigureDesc", "Les enregistrements A et AAAA pointant vers cet hébergement seront supprimés de la zone DNS.")}
                </p>
                {!autoConfigureAvailable && (
                  <p className="checkbox-warning">
                    {t("multisite.delete.autoconfigureUnavailable", "Non disponible : la zone DNS n'est pas gérée par OVHcloud.")}
                  </p>
                )}
              </div>

              {/* Warning Git */}
              {domain.git && (
                <div className="alert alert-warning">
                  <span className="alert-icon">⚠️</span>
                  <p>{t("multisite.delete.gitWarning", "Ce domaine a une association Git. Elle sera également supprimée.")}</p>
                </div>
              )}

              {/* Error */}
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
            onClick={onClose}
            disabled={loading}
          >
            {t("common.cancel", "Annuler")}
          </button>
          <button 
            type="button" 
            className="wh-modal-btn-danger" 
            onClick={handleDelete}
            disabled={loading || checking}
          >
            {loading ? (
              <><span className="spinner-small" /> Suppression...</>
            ) : (
              t("common.delete", "Supprimer")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteDomainWizard;
