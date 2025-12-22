// ============================================================
// HOSTING TAB: GENERAL - Informations générales (3 colonnes)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Hosting, HostingServiceInfos } from "../../../../../services/web-cloud.hosting";
import { ActionMenu } from "../components/ActionMenu";

interface Props { serviceName: string; }

/** Onglet Informations générales - Layout 3 colonnes comme Old Manager. */
export function GeneralTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [serviceInfos, setServiceInfos] = useState<HostingServiceInfos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, infos] = await Promise.all([
        hostingService.getHosting(serviceName),
        hostingService.getServiceInfos(serviceName).catch(() => null)
      ]);
      setHosting(hostingData);
      setServiceInfos(infos);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadData(); }, [loadData]);

  // ---------- HELPERS ----------
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatQuota = (quota?: { value: number; unit: string }) => {
    if (!quota) return "-";
    const val = quota.unit === "MB" ? (quota.value / 1024).toFixed(2) : quota.value;
    return `${val} Go`;
  };

  const getQuotaPercent = () => {
    if (!hosting?.quotaUsed?.value || !hosting?.quotaSize?.value) return 0;
    return Math.round((hosting.quotaUsed.value / hosting.quotaSize.value) * 100);
  };

  const getStateBadge = (state?: string) => {
    const map: Record<string, { class: string; label: string }> = {
      active: { class: "success", label: "Actif" },
      bloqued: { class: "error", label: "Bloqué" },
      maintenance: { class: "warning", label: "Maintenance" },
    };
    return map[state || ""] || { class: "inactive", label: state || "-" };
  };

  const managerBaseUrl = `https://www.ovh.com/manager/#/web/hosting/${serviceName}`;

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!hosting) return <div className="empty-state">Aucune donnée</div>;

  const quotaPercent = getQuotaPercent();

  // ---------- RENDER ----------
  return (
    <div className="general-tab">
      {/* Layout 3 colonnes */}
      <div className="general-grid">
        {/* COLONNE 1 : Informations générales */}
        <section className="general-card">
          <h4>Informations générales</h4>
          
          <div className="info-row">
            <span className="info-label">État du service</span>
            <span className="info-value">
              <span className={`badge ${getStateBadge(hosting.state).class}`}>
                {getStateBadge(hosting.state).label}
              </span>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">IPv4</span>
            <span className="info-value copyable">
              <code>{hosting.hostingIp || "-"}</code>
              {hosting.hostingIp && (
                <button className="copy-btn" onClick={() => copyToClipboard(hosting.hostingIp)} title="Copier">
                  📋
                </button>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">IPv6</span>
            <span className="info-value copyable">
              <code>{hosting.hostingIpv6 || "-"}</code>
              {hosting.hostingIpv6 && (
                <button className="copy-btn" onClick={() => copyToClipboard(hosting.hostingIpv6!)} title="Copier">
                  📋
                </button>
              )}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Espace disque</span>
            <span className="info-value">
              <div className="quota-display">
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${quotaPercent > 90 ? 'danger' : quotaPercent > 70 ? 'warning' : ''}`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
                <span className="quota-text">
                  {formatQuota(hosting.quotaUsed)} / {formatQuota(hosting.quotaSize)}
                </span>
              </div>
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Datacenter</span>
            <span className="info-value">{hosting.datacenter || "-"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Cluster</span>
            <span className="info-value">{hosting.cluster || "-"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Filer</span>
            <span className="info-value">{hosting.filer || "-"}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Dossier racine</span>
            <span className="info-value"><code>{hosting.home || "-"}</code></span>
          </div>
        </section>

        {/* COLONNE 2 : Configuration */}
        <section className="general-card">
          <h4>Configuration</h4>

          <div className="info-row with-action">
            <span className="info-label">Version PHP globale</span>
            <span className="info-value">
              <code>{hosting.phpVersion || "-"}</code>
              {hosting.phpVersion && parseFloat(hosting.phpVersion) < 8.0 && (
                <span className="badge warning" title="Version obsolète">⚠️</span>
              )}
            </span>
            <ActionMenu actions={[
              { label: "Modifier la version PHP", href: `${managerBaseUrl}/php`, external: true },
              { label: "Voir les versions disponibles", href: "https://docs.ovh.com/fr/hosting/configurer-le-php-sur-son-hebergement-web/", external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Adresses e-mails</span>
            <span className="info-value">
              <span className={`badge ${hosting.hasEmail ? 'success' : 'inactive'}`}>
                {hosting.hasEmail ? "Actif" : "Non"}
              </span>
            </span>
            <ActionMenu actions={[
              { label: "Gérer les emails", href: `${managerBaseUrl}/email`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Option CDN</span>
            <span className="info-value">
              <span className={`badge ${hosting.hasCdn ? 'success' : 'inactive'}`}>
                {hosting.hasCdn ? "Actif" : "Non"}
              </span>
            </span>
            <ActionMenu actions={[
              { label: hosting.hasCdn ? "Gérer le CDN" : "Activer le CDN", href: `${managerBaseUrl}/cdn`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Certificat SSL</span>
            <span className="info-value">
              <span className={`badge ${hosting.hasHostedSsl ? 'success' : 'inactive'}`}>
                {hosting.hasHostedSsl ? "Actif" : "Non"}
              </span>
            </span>
            <ActionMenu actions={[
              { label: "Gérer SSL", href: `${managerBaseUrl}/ssl`, external: true },
              { label: "Commander Sectigo", href: `${managerBaseUrl}/ssl/order`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Bases de données</span>
            <span className="info-value">
              {hosting.databaseCount !== undefined ? `${hosting.databaseCount}` : "-"}
            </span>
            <ActionMenu actions={[
              { label: "Gérer les BDD", href: `${managerBaseUrl}/database`, external: true },
              { label: "Créer une BDD", href: `${managerBaseUrl}/database/add`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Web Cloud Databases</span>
            <span className="info-value">{hosting.privateDbCount || "0"}</span>
            <ActionMenu actions={[
              { label: "Voir les CloudDB", href: "/web-cloud/hebergement?section=private-database" }
            ]} />
          </div>
        </section>

        {/* COLONNE 3 : Abonnement */}
        <section className="general-card">
          <h4>Abonnement</h4>

          <div className="info-row with-action">
            <span className="info-label">Offre</span>
            <span className="info-value">
              <strong>{hosting.offer || "-"}</strong>
            </span>
            <ActionMenu actions={[
              { label: "Changer d'offre", href: `${managerBaseUrl}/upgrade`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Renouvellement automatique</span>
            <span className="info-value">
              {serviceInfos?.renew?.automatic ? (
                <span>{formatDate(serviceInfos.expiration)}</span>
              ) : (
                <span className="badge warning">Manuel</span>
              )}
            </span>
            <ActionMenu actions={[
              { label: "Gérer le renouvellement", href: `https://www.ovh.com/manager/#/billing/autoRenew?searchText=${serviceName}`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Boost</span>
            <span className="info-value">
              {hosting.boostOffer ? (
                <span className="badge success">{hosting.boostOffer}</span>
              ) : (
                <span className="badge inactive">Indisponible</span>
              )}
            </span>
            <ActionMenu actions={[
              { label: hosting.boostOffer ? "Gérer le Boost" : "Commander Boost", href: `${managerBaseUrl}/boost`, external: true }
            ]} />
          </div>

          <div className="info-row with-action">
            <span className="info-label">Contacts</span>
            <span className="info-value contacts-list">
              {serviceInfos?.contactAdmin && <span>{serviceInfos.contactAdmin}: Admin</span>}
              {serviceInfos?.contactTech && <span>{serviceInfos.contactTech}: Tech</span>}
              {serviceInfos?.contactBilling && <span>{serviceInfos.contactBilling}: Facturation</span>}
            </span>
            <ActionMenu actions={[
              { label: "Gérer les contacts", href: `https://www.ovh.com/manager/#/contacts/services?serviceName=${serviceName}`, external: true }
            ]} />
          </div>

          <div className="info-row">
            <span className="info-label">Date de création</span>
            <span className="info-value">{formatDate(serviceInfos?.creation)}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Date d'expiration</span>
            <span className="info-value">{formatDate(serviceInfos?.expiration)}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GeneralTab;
