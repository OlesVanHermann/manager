// ============================================================
// COMPOSANT - DomainView (Liste domaines dans LeftPanel)
// Améliorations: Filtrage/pagination gérés par parent
// ============================================================

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailDomain, EmailOffer } from "../../types";
import { OFFER_CONFIG } from "./emails.constants";

interface DomainViewProps {
  domains: EmailDomain[];
  selectedDomain: string | null;
  onSelect: (name: string) => void;
}

/** Vue par domaine dans le panel gauche. Reçoit domains déjà filtré/paginé. */
export function DomainView({ domains, selectedDomain, onSelect }: DomainViewProps) {
  const { t } = useTranslation("web-cloud/emails/index");

  if (domains.length === 0) {
    return (
      <div className="left-panel-empty">
        <p>{t("leftPanel.noDomain")}</p>
      </div>
    );
  }

  return (
    <div className="domain-list">
      {domains.map((domain) => (
        <DomainItem
          key={domain.name}
          domain={domain}
          isSelected={domain.name === selectedDomain}
          onSelect={() => onSelect(domain.name)}
        />
      ))}
    </div>
  );
}

// ---------- DOMAIN ITEM ----------

interface DomainItemProps {
  domain: EmailDomain;
  isSelected: boolean;
  onSelect: () => void;
}

function DomainItem({ domain, isSelected, onSelect }: DomainItemProps) {
  const offerCounts = useMemo(() => {
    const counts: Partial<Record<EmailOffer, number>> = {};
    domain.accounts.forEach(acc => {
      counts[acc.offer] = (counts[acc.offer] || 0) + 1;
    });
    return counts;
  }, [domain.accounts]);

  return (
    <button
      className={`domain-item ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <div className="domain-item-header">
        <span className="domain-item-icon">📧</span>
        <span className="domain-item-name">{domain.name}</span>
      </div>

      <div className="domain-item-offers">
        {(Object.entries(offerCounts) as [EmailOffer, number][]).map(([offer, count]) => (
          <div key={offer} className="domain-item-offer">
            <span
              className="offer-dot"
              style={{ backgroundColor: OFFER_CONFIG[offer].color }}
            />
            <span className="offer-count">{count}</span>
            <span className="offer-label">{OFFER_CONFIG[offer].label}</span>
          </div>
        ))}
      </div>

      <div className="domain-item-footer">
        <span className="domain-item-stats">
          {domain.totalAccounts} boîte{domain.totalAccounts > 1 ? "s" : ""}
          {domain.totalQuotaUsed > 0 && ` · ${formatQuota(domain.totalQuotaUsed)}`}
        </span>
      </div>
    </button>
  );
}

// ---------- HELPERS ----------

function formatQuota(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} Go`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} Mo`;
}
