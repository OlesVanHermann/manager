// ============================================================
// COMPONENT: DomainsTable - Liste des domaines du pack
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AllDomDomain } from "../../../../services/web-cloud.alldom";

interface Props {
  domains: AllDomDomain[];
  serviceName: string;
  hasTerminateAction: boolean;
}

export function DomainsTable({ domains, serviceName, hasTerminateAction }: Props) {
  const { t } = useTranslation("web-cloud/alldom/index");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDomains = domains.filter((d) => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const registeredCount = domains.filter(d => d.registrationStatus === "REGISTERED").length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  return (
    <div className="domains-section">
      <div className="section-header-with-search">
        <div>
          <h3>{t("domains.title")}</h3>
          <span className="section-subtitle">
            {registeredCount} / {domains.length} {t("domains.registered")}
          </span>
        </div>
        <input
          type="text"
          placeholder={t("domains.search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input search-input-sm"
        />
      </div>

      {hasTerminateAction && (
        <div className="info-box info-box-warning">
          <p>{t("domains.terminateInfo")}</p>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>{t("domains.name")}</th>
            <th>{t("domains.status")}</th>
            <th>{t("domains.expiration")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredDomains.map((domain) => (
            <tr key={domain.name}>
              <td className="font-mono">{domain.name}</td>
              <td>
                <span className={`badge ${domain.registrationStatus === "REGISTERED" ? "success" : "warning"}`}>
                  {domain.registrationStatus === "REGISTERED" ? t("domains.statusRegistered") : t("domains.statusUnregistered")}
                </span>
              </td>
              <td>{formatDate(domain.expiresAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredDomains.length === 0 && (
        <div className="empty-state empty-state-sm">
          <p>{t("domains.noResults")}</p>
        </div>
      )}
    </div>
  );
}
