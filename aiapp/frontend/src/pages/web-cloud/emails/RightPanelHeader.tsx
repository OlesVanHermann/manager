// ============================================================
// COMPOSANT - RightPanelHeader (Header du panel droit)
// Adapté pour NAV3 [General] [Packs]
// ============================================================

import { useTranslation } from "react-i18next";
import { Nav3Mode, EmailDomain, EmailLicense } from "./types";
import { OFFER_CONFIG } from "./emails.constants";

interface RightPanelHeaderProps {
  nav3Mode: Nav3Mode;
  selectedDomain: EmailDomain | null;
  selectedLicense: EmailLicense | null;
}

/** Header du panel droit avec infos domaine ou licence. */
export function RightPanelHeader({ nav3Mode, selectedDomain, selectedLicense }: RightPanelHeaderProps) {
  const { t } = useTranslation("web-cloud/emails/index");

  if (nav3Mode === "general" && selectedDomain) {
    return (
      <div className="right-panel-header">
        <div className="right-panel-header-main">
          <h1 className="right-panel-title">{selectedDomain.name}</h1>
          <a
            href={`https://webmail.ovh.net/?domain=${selectedDomain.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            onClick={() => console.log("[RightPanelHeader] Action: Webmail clicked for domain", selectedDomain.name)}
          >
            ↗ Webmail
          </a>
        </div>
        <p className="right-panel-subtitle">
          {selectedDomain.totalAccounts} boîte{selectedDomain.totalAccounts > 1 ? "s" : ""}
          {" · "}
          {selectedDomain.offers.length} offre{selectedDomain.offers.length > 1 ? "s" : ""}
          {selectedDomain.totalQuotaUsed > 0 && (
            <> · {formatQuota(selectedDomain.totalQuotaUsed)} utilisés</>
          )}
        </p>
        <div className="right-panel-offers">
          {selectedDomain.offers.map((offer) => {
            const config = OFFER_CONFIG[offer];
            const count = selectedDomain.accounts.filter(a => a.offer === offer).length;
            return (
              <span key={offer} className="offer-tag">
                <span className="offer-dot" style={{ backgroundColor: config.color }} />
                {count} {config.label}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (nav3Mode === "packs" && selectedLicense) {
    const config = OFFER_CONFIG[selectedLicense.offer];
    return (
      <div className="right-panel-header">
        <div className="right-panel-header-main">
          <h1 className="right-panel-title">
            Pack "{selectedLicense.name}"
          </h1>
          <button className="btn btn-outline btn-sm" onClick={() => console.log("[RightPanelHeader] Action: Manage pack clicked", selectedLicense?.id)}>⚙ {t("rightPanel.manage")}</button>
        </div>
        <p className="right-panel-subtitle">
          <span className="offer-dot" style={{ backgroundColor: config.color }} />
          {selectedLicense.usedLicenses}/{selectedLicense.totalLicenses} licences
          {" · "}
          {selectedLicense.scope === "multi-domain" ? "Multi-domaine" : selectedLicense.scopeDomain}
          {" · "}
          {selectedLicense.pricePerMonth.toFixed(2)} €/mois
        </p>
      </div>
    );
  }

  return (
    <div className="right-panel-header">
      <div className="right-panel-header-main">
        <h1 className="right-panel-title">{t("rightPanel.selectItem")}</h1>
      </div>
      <p className="right-panel-subtitle">{t("rightPanel.selectHint")}</p>
    </div>
  );
}

// ---------- HELPERS ----------

function formatQuota(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} Go`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} Mo`;
}
