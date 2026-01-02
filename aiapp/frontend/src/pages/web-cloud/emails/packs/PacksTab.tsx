// ============================================================
// SUB-TAB - Packs (Services email groupés)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "../OfferBadge";
import { services, billing } from "../api";
import type { EmailServiceSummary, EmailServiceType } from "../api";
import type { EmailOffer } from "../types";

interface PackDisplay {
  id: string;
  name: string;
  displayName: string;
  offer: EmailOffer;
  offerDetail?: string;
  type: EmailServiceType;
  organization?: string;
  totalLicenses: number;
  usedLicenses: number;
  domains: string[];
  renewalDate?: string;
  state: "active" | "suspended" | "expiring";
}

/** Sous-onglet Packs - Gestion des services email. */
export default function PacksTab() {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [packs, setPacks] = useState<PackDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des services email
  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer tous les services email
      const allServices = await services.getAllEmailServices();

      // Enrichir avec les infos de comptes
      const packsWithDetails: PackDisplay[] = await Promise.all(
        allServices.map(async (svc: EmailServiceSummary) => {
          let usedLicenses = 0;
          let totalLicenses = 0;

          try {
            // Récupérer le nombre de comptes
            const accountsCount = await services.getServiceAccountsCount(svc);
            usedLicenses = accountsCount;

            // Pour Exchange/EmailPro, récupérer les détails de facturation
            if (svc.type === "exchange" || svc.type === "emailpro") {
              const accounts = await billing.getAccountsBillingForService(
                svc.type,
                svc.id,
                svc.organization,
                { count: 1000 }
              );
              totalLicenses = accounts.length;
              usedLicenses = accounts.filter(a => a.state === "ok").length;
            } else {
              totalLicenses = accountsCount;
            }
          } catch {
            // Fallback si erreur
            totalLicenses = svc.accountsCount || 0;
            usedLicenses = svc.accountsCount || 0;
          }

          // Mapper l'état
          let state: PackDisplay["state"] = "active";
          if (svc.state === "suspended") state = "suspended";
          else if (svc.state === "expired") state = "expiring";

          // Mapper l'offre
          let offer: EmailOffer = "mx-plan";
          if (svc.type === "exchange") offer = "exchange";
          else if (svc.type === "emailpro") offer = "email-pro";
          else if (svc.type === "zimbra") offer = "zimbra";

          return {
            id: svc.id,
            name: svc.name,
            displayName: svc.displayName,
            offer,
            offerDetail: svc.offerDetail,
            type: svc.type,
            organization: svc.organization,
            totalLicenses,
            usedLicenses,
            domains: [svc.domain],
            renewalDate: svc.renewalDate,
            state,
          };
        })
      );

      setPacks(packsWithDetails);
    } catch (err) {
      console.error("Failed to load email services:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleAddPack = () => {
    // Ouvre la page de commande OVH emails
    window.open("https://www.ovh.com/fr/emails/", "_blank");
  };

  const handleUpgrade = (pack: PackDisplay) => {
    // URL vers le manager pour ajouter des licences
    // Format: /web/email-{type}/{org}/{service}/account/add
    const typeSlug = pack.type === "exchange" ? "exchange" : pack.type === "emailpro" ? "email-pro" : pack.type;
    const org = pack.organization || pack.id;
    const managerUrl = `https://www.ovh.com/manager/web/#/email-${typeSlug}/${org}/${pack.id}/account/add`;
    window.open(managerUrl, "_blank");
  };

  const handleManage = (pack: PackDisplay) => {
    // URL vers le manager pour gérer le service
    const typeSlug = pack.type === "exchange" ? "exchange" : pack.type === "emailpro" ? "email-pro" : pack.type;
    const org = pack.organization || pack.id;
    const managerUrl = `https://www.ovh.com/manager/web/#/email-${typeSlug}/${org}/${pack.id}`;
    window.open(managerUrl, "_blank");
  };

  const handleRenew = (pack: PackDisplay) => {
    // URL vers le manager pour renouveler le service
    const managerUrl = `https://www.ovh.com/manager/dedicated/#/billing/autoRenew?searchText=${encodeURIComponent(pack.id)}`;
    window.open(managerUrl, "_blank");
  };

  const getUsagePercent = (used: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 100) return "#DC2626";
    if (percent >= 80) return "#D97706";
    return "#059669";
  };

  const getOfferLabel = (pack: PackDisplay): string => {
    if (pack.offerDetail) {
      return `${pack.offer === "exchange" ? "Exchange" : pack.offer === "email-pro" ? "Email Pro" : pack.offer} ${pack.offerDetail}`;
    }
    return pack.offer === "exchange" ? "Exchange" : pack.offer === "email-pro" ? "Email Pro" : pack.offer === "zimbra" ? "Zimbra" : "MX Plan";
  };

  if (loading) {
    return (
      <div className="packs-tab">
        <div className="emails-loading">
          <div className="loading-spinner" />
          <p>{t("loading", "Chargement des services...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="packs-tab">
        <div className="emails-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadServices}>
            {t("retry", "Réessayer")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="packs-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleAddPack}>
            + {t("packs.actions.addPack", "Commander un service")}
          </button>
        </div>
        <div className="emails-toolbar-right">
          <button className="btn btn-outline" onClick={loadServices}>
            ↻ {t("refresh", "Actualiser")}
          </button>
        </div>
      </div>

      {/* Packs list */}
      {packs.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📦</div>
          <h3 className="emails-empty-title">{t("packs.empty.title", "Aucun service email")}</h3>
          <p className="emails-empty-text">{t("packs.empty.description", "Vous n'avez pas encore de service email. Commandez-en un pour commencer.")}</p>
          <button className="btn btn-primary" onClick={handleAddPack}>
            + {t("packs.actions.addPack", "Commander un service")}
          </button>
        </div>
      ) : (
        <div className="packs-grid">
          {packs.map((pack) => {
            const usagePercent = getUsagePercent(pack.usedLicenses, pack.totalLicenses);
            const usageColor = getUsageColor(usagePercent);

            return (
              <div key={pack.id} className={`pack-card ${pack.state}`}>
                <div className="pack-header">
                  <div className="pack-title">
                    <h3>{pack.displayName || pack.name}</h3>
                    <OfferBadge offer={pack.offer} />
                  </div>
                  <span className={`status-badge ${pack.state === "active" ? "ok" : pack.state === "expiring" ? "pending" : "suspended"}`}>
                    {pack.state === "active" ? t("status.active", "Actif") : pack.state === "expiring" ? t("status.expiring", "Expire bientôt") : t("status.suspended", "Suspendu")}
                  </span>
                </div>

                <div className="pack-usage">
                  <div className="usage-header">
                    <span className="usage-label">{t("packs.usage", "Utilisation")}</span>
                    <span className="usage-value">
                      {pack.usedLicenses} / {pack.totalLicenses} {t("packs.accounts", "comptes")}
                    </span>
                  </div>
                  <div className="usage-bar">
                    <div
                      className="usage-bar-fill"
                      style={{ width: `${Math.min(usagePercent, 100)}%`, backgroundColor: usageColor }}
                    />
                  </div>
                </div>

                <div className="pack-details">
                  <div className="detail-row">
                    <span className="detail-label">{t("packs.type", "Type")}:</span>
                    <span className="detail-value">{getOfferLabel(pack)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t("packs.domains", "Domaines")}:</span>
                    <span className="detail-value domains-list">
                      {pack.domains.join(", ")}
                    </span>
                  </div>
                  {pack.renewalDate && (
                    <div className="detail-row">
                      <span className="detail-label">{t("packs.renewal", "Renouvellement")}:</span>
                      <span className={`detail-value ${pack.state === "expiring" ? "text-warning" : ""}`}>
                        {new Date(pack.renewalDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pack-actions">
                  {usagePercent >= 80 && pack.totalLicenses > 0 && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpgrade(pack)}>
                      ↑ {t("packs.actions.upgrade", "Ajouter des comptes")}
                    </button>
                  )}
                  {pack.state === "expiring" && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleRenew(pack)}>
                      ↻ {t("packs.actions.renew", "Renouveler")}
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => handleManage(pack)}>
                    ⚙ {t("packs.actions.manage", "Gérer")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
