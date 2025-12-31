// ============================================================
// SUB-TAB - Packs (Packs de licences groupées)
// ============================================================

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "../OfferBadge";
import { EmailOffer } from "../types";

interface LicensePack {
  id: string;
  name: string;
  offer: EmailOffer;
  totalLicenses: number;
  usedLicenses: number;
  pricePerLicense: number;
  totalPrice: number;
  scope: "single-domain" | "multi-domain";
  domains: string[];
  renewalDate: string;
  status: "active" | "suspended" | "expiring";
}

/** Sous-onglet Packs - Gestion des packs de licences. */
export default function PacksTab() {
  const { t } = useTranslation("web-cloud/emails/licenses");

  // Mock data - remplacer par appel API
  const packs: LicensePack[] = useMemo(() => [
    {
      id: "1",
      name: "Pack Exchange Pro",
      offer: "exchange",
      totalLicenses: 25,
      usedLicenses: 18,
      pricePerLicense: 4.99,
      totalPrice: 124.75,
      scope: "multi-domain",
      domains: ["example.com", "example.fr", "example.net"],
      renewalDate: "2024-06-15T00:00:00Z",
      status: "active",
    },
    {
      id: "2",
      name: "Pack Email Pro Startup",
      offer: "email-pro",
      totalLicenses: 10,
      usedLicenses: 10,
      pricePerLicense: 2.99,
      totalPrice: 29.90,
      scope: "single-domain",
      domains: ["startup.io"],
      renewalDate: "2024-02-01T00:00:00Z",
      status: "expiring",
    },
    {
      id: "3",
      name: "Pack Zimbra Team",
      offer: "zimbra",
      totalLicenses: 5,
      usedLicenses: 3,
      pricePerLicense: 3.99,
      totalPrice: 19.95,
      scope: "single-domain",
      domains: ["team.org"],
      renewalDate: "2024-12-01T00:00:00Z",
      status: "active",
    },
  ], []);

  const handleAddPack = () => {
    console.log("Add new pack");
  };

  const handleUpgrade = (pack: LicensePack) => {
    console.log("Upgrade pack", pack.id);
  };

  const handleManage = (pack: LicensePack) => {
    console.log("Manage pack", pack.id);
  };

  const handleRenew = (pack: LicensePack) => {
    console.log("Renew pack", pack.id);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getUsagePercent = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percent: number) => {
    if (percent >= 100) return "#EF4444";
    if (percent >= 80) return "#F59E0B";
    return "#10B981";
  };

  return (
    <div className="packs-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleAddPack}>
            + {t("packs.actions.addPack")}
          </button>
        </div>
      </div>

      {/* Packs list */}
      {packs.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📦</div>
          <h3 className="emails-empty-title">{t("packs.empty.title")}</h3>
          <p className="emails-empty-text">{t("packs.empty.description")}</p>
          <button className="btn btn-primary" onClick={handleAddPack}>
            + {t("packs.actions.addPack")}
          </button>
        </div>
      ) : (
        <div className="packs-grid">
          {packs.map((pack) => {
            const usagePercent = getUsagePercent(pack.usedLicenses, pack.totalLicenses);
            const usageColor = getUsageColor(usagePercent);

            return (
              <div key={pack.id} className={`pack-card ${pack.status}`}>
                <div className="pack-header">
                  <div className="pack-title">
                    <h3>{pack.name}</h3>
                    <OfferBadge offer={pack.offer} />
                  </div>
                  <span className={`status-badge ${pack.status === "active" ? "ok" : pack.status === "expiring" ? "pending" : "suspended"}`}>
                    {pack.status === "active" ? "Actif" : pack.status === "expiring" ? "Expire bientôt" : "Suspendu"}
                  </span>
                </div>

                <div className="pack-usage">
                  <div className="usage-header">
                    <span className="usage-label">{t("packs.usage")}</span>
                    <span className="usage-value">
                      {pack.usedLicenses} / {pack.totalLicenses} {t("packs.licenses")}
                    </span>
                  </div>
                  <div className="usage-bar">
                    <div
                      className="usage-bar-fill"
                      style={{ width: `${usagePercent}%`, backgroundColor: usageColor }}
                    />
                  </div>
                </div>

                <div className="pack-details">
                  <div className="detail-row">
                    <span className="detail-label">{t("packs.scope")}:</span>
                    <span className="detail-value">
                      {pack.scope === "multi-domain" ? "Multi-domaine" : "Mono-domaine"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t("packs.domains")}:</span>
                    <span className="detail-value domains-list">
                      {pack.domains.join(", ")}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t("packs.renewal")}:</span>
                    <span className={`detail-value ${pack.status === "expiring" ? "text-warning" : ""}`}>
                      {formatDate(pack.renewalDate)}
                    </span>
                  </div>
                  <div className="detail-row price">
                    <span className="detail-label">{t("packs.price")}:</span>
                    <span className="detail-value price-value">
                      {pack.totalPrice.toFixed(2)} €/mois
                    </span>
                  </div>
                </div>

                <div className="pack-actions">
                  {usagePercent >= 80 && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpgrade(pack)}>
                      ↑ {t("packs.actions.upgrade")}
                    </button>
                  )}
                  {pack.status === "expiring" && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleRenew(pack)}>
                      ↻ {t("packs.actions.renew")}
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => handleManage(pack)}>
                    ⚙ {t("packs.actions.manage")}
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
