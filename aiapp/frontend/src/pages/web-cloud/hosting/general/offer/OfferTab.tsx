// ============================================================
// OFFER TAB - Affichage informations offre actuelle
// NAV3: Offre > NAV4: Offre
// Displays: current offer, service info, capabilities
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { offerService, type ServiceInfos, type OfferCapabilities } from "./OfferTab.service";
import type { Hosting } from "../../hosting.types";
import "./OfferTab.css";

interface OfferTabProps {
  serviceName: string;
  details: Hosting;
  onTabChange?: (tabId: string) => void;
  onRefresh?: () => void;
}

export function OfferTab({ serviceName, details, onTabChange }: OfferTabProps) {
  const { t } = useTranslation("web-cloud/hosting/index");

  const [loading, setLoading] = useState(true);
  const [serviceInfos, setServiceInfos] = useState<ServiceInfos | null>(null);
  const [capabilities, setCapabilities] = useState<OfferCapabilities | null>(null);
  const [availableUpgrades, setAvailableUpgrades] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load all data
  // Note: Chaque appel a son propre catch pour éviter qu'une erreur bloque tout
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Valider offer avant appel (évite 400 "Missing offer parameter")
      const offerName = details.offer?.trim();

      const [infos, caps, upgrades] = await Promise.all([
        offerService.getServiceInfos(serviceName),
        // getOfferCapabilities: null si offer vide ou erreur API
        offerName
          ? offerService.getOfferCapabilities(offerName).catch(() => null)
          : Promise.resolve(null),
        offerService.getAvailableUpgrades(serviceName),
      ]);

      setServiceInfos(infos);
      setCapabilities(caps);
      setAvailableUpgrades(upgrades);
    } catch (err) {
      setError("Erreur lors du chargement des informations");
      console.error("[OfferTab] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, details.offer]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format size with unit
  const formatSize = (obj: { value: number; unit: string } | undefined) => {
    if (!obj) return "-";
    return `${obj.value} ${obj.unit}`;
  };

  // Get renewal status text
  const getRenewalStatus = () => {
    if (!serviceInfos?.renew) return "-";
    if (serviceInfos.renew.deleteAtExpiration) return "Résiliation programmée";
    if (serviceInfos.renew.automatic) return "Automatique";
    return "Manuel";
  };

  // Navigate to change tab
  const handleChangeOffer = () => {
    if (onTabChange) {
      onTabChange("change");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="offertab">
        <div className="offertab-skeleton">
          <div className="offertab-skeleton-header" />
          <div className="offertab-skeleton-grid">
            <div className="offertab-skeleton-card" />
            <div className="offertab-skeleton-card" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="offertab">
        <div className="offertab-error">
          <span className="offertab-error-icon">⚠️</span>
          <p>{error}</p>
          <button className="offertab-btn-retry" onClick={loadData}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="offertab">
      {/* Header */}
      <div className="offertab-header">
        <div>
          <h3 className="offertab-title">Informations de l'offre</h3>
          <p className="offertab-subtitle">
            Détails de votre hébergement et capacités incluses
          </p>
        </div>
        {availableUpgrades.length > 0 && (
          <button className="offertab-btn-change" onClick={handleChangeOffer}>
            Changer d'offre
          </button>
        )}
      </div>

      {/* Current Offer Banner */}
      <div className="offertab-current">
        <div className="offertab-current-icon">📦</div>
        <div className="offertab-current-info">
          <span className="offertab-current-label">Offre actuelle</span>
          <span className="offertab-current-name">{details.offer || "Standard"}</span>
        </div>
        <div className="offertab-current-status">
          <span className={`offertab-badge ${details.state === "active" ? "success" : "warning"}`}>
            {details.state === "active" ? "Actif" : details.state}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="offertab-grid">
        {/* Service Info Card */}
        <div className="offertab-card">
          <h4 className="offertab-card-title">Informations du service</h4>
          <div className="offertab-info-list">
            <div className="offertab-info-row">
              <span className="offertab-info-label">Nom du service</span>
              <span className="offertab-info-value">{serviceName}</span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Date de création</span>
              <span className="offertab-info-value">
                {formatDate(serviceInfos?.creation || "")}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Date d'expiration</span>
              <span className="offertab-info-value">
                {formatDate(serviceInfos?.expiration || "")}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Renouvellement</span>
              <span className="offertab-info-value">{getRenewalStatus()}</span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Datacenter</span>
              <span className="offertab-info-value">{details.datacenter || "-"}</span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Cluster</span>
              <span className="offertab-info-value font-mono">{details.cluster || "-"}</span>
            </div>
          </div>
        </div>

        {/* Capabilities Card */}
        <div className="offertab-card">
          <h4 className="offertab-card-title">Capacités de l'offre</h4>
          <div className="offertab-info-list">
            <div className="offertab-info-row">
              <span className="offertab-info-label">Espace disque</span>
              <span className="offertab-info-value">
                {formatSize(capabilities?.diskSize)}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Trafic mensuel</span>
              <span className="offertab-info-value">
                {capabilities?.traffic?.value
                  ? formatSize(capabilities.traffic as any)
                  : "Illimité"}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Bases de données</span>
              <span className="offertab-info-value">
                {capabilities?.databases?.[0]?.available ?? "-"}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Comptes email</span>
              <span className="offertab-info-value">
                {capabilities?.emails?.available ?? "-"}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Comptes FTP</span>
              <span className="offertab-info-value">
                {capabilities?.ftp?.number ?? "-"}
              </span>
            </div>
            <div className="offertab-info-row">
              <span className="offertab-info-label">Sites recommandés</span>
              <span className="offertab-info-value">
                {capabilities?.sitesRecommended ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="offertab-card">
          <h4 className="offertab-card-title">Fonctionnalités incluses</h4>
          <div className="offertab-features">
            <div className={`offertab-feature ${capabilities?.ssh ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.ssh ? "✓" : "✗"}</span>
              <span>Accès SSH</span>
            </div>
            <div className={`offertab-feature ${capabilities?.ssl ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.ssl ? "✓" : "✗"}</span>
              <span>Certificat SSL</span>
            </div>
            <div className={`offertab-feature ${capabilities?.hasCdn ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.hasCdn ? "✓" : "✗"}</span>
              <span>CDN inclus</span>
            </div>
            <div className={`offertab-feature ${capabilities?.crontab ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.crontab ? "✓" : "✗"}</span>
              <span>Tâches CRON</span>
            </div>
            <div className={`offertab-feature ${capabilities?.git ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.git ? "✓" : "✗"}</span>
              <span>Déploiement Git</span>
            </div>
            <div className={`offertab-feature ${capabilities?.envVars ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.envVars ? "✓" : "✗"}</span>
              <span>Variables d'environnement</span>
            </div>
            <div className={`offertab-feature ${capabilities?.moduleOneClick ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.moduleOneClick ? "✓" : "✗"}</span>
              <span>Modules en 1 clic</span>
            </div>
            <div className={`offertab-feature ${capabilities?.multisite ? "enabled" : "disabled"}`}>
              <span className="offertab-feature-icon">{capabilities?.multisite ? "✓" : "✗"}</span>
              <span>Multisite</span>
            </div>
          </div>
        </div>

        {/* Languages Card */}
        {capabilities?.languages && (
          <div className="offertab-card">
            <h4 className="offertab-card-title">Langages disponibles</h4>
            <div className="offertab-languages">
              {capabilities.languages.php?.length > 0 && (
                <div className="offertab-lang-group">
                  <span className="offertab-lang-name">PHP</span>
                  <span className="offertab-lang-versions">
                    {capabilities.languages.php.join(", ")}
                  </span>
                </div>
              )}
              {capabilities.languages.nodejs?.length > 0 && (
                <div className="offertab-lang-group">
                  <span className="offertab-lang-name">Node.js</span>
                  <span className="offertab-lang-versions">
                    {capabilities.languages.nodejs.join(", ")}
                  </span>
                </div>
              )}
              {capabilities.languages.python?.length > 0 && (
                <div className="offertab-lang-group">
                  <span className="offertab-lang-name">Python</span>
                  <span className="offertab-lang-versions">
                    {capabilities.languages.python.join(", ")}
                  </span>
                </div>
              )}
              {capabilities.languages.ruby?.length > 0 && (
                <div className="offertab-lang-group">
                  <span className="offertab-lang-name">Ruby</span>
                  <span className="offertab-lang-versions">
                    {capabilities.languages.ruby.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade CTA */}
      {availableUpgrades.length > 0 && (
        <div className="offertab-upgrade-cta">
          <div className="offertab-upgrade-info">
            <span className="offertab-upgrade-icon">🚀</span>
            <div>
              <strong>Besoin de plus de ressources ?</strong>
              <p>{availableUpgrades.length} offre(s) supérieure(s) disponible(s)</p>
            </div>
          </div>
          <button className="offertab-btn-upgrade" onClick={handleChangeOffer}>
            Voir les offres
          </button>
        </div>
      )}
    </div>
  );
}

export default OfferTab;
