// ============================================================
// DNS INFO TAB - Dashboard DNS (resume zone, statut propagation)
// Groupe: DNS
// ============================================================

import "./DnsInfoTab.css";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { dnsInfoService, type DnsInfoSummary } from "./DnsInfoTab.service";

interface DnsInfoTabProps {
  zoneName: string;
}

export const DnsInfoTab: React.FC<DnsInfoTabProps> = ({ zoneName }) => {
  const { t } = useTranslation("web-cloud/domains/dns-info");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DnsInfoSummary | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await dnsInfoService.getSummary(zoneName);
        setSummary(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [zoneName]);

  if (loading) {
    return (
      <div className="dnsinfo-loading">
        <div className="dnsinfo-skeleton" />
        <div className="dnsinfo-skeleton" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="dnsinfo-error">
        <p>{t("error.loadFailed")}</p>
      </div>
    );
  }

  return (
    <div className="dnsinfo-container">
      {/* Zone Status */}
      <div className="dnsinfo-section">
        <h3 className="dnsinfo-section-title">{t("section.zoneStatus")}</h3>
        <div className="dnsinfo-cards">
          <div className="dnsinfo-card">
            <div className="dnsinfo-card-label">{t("label.lastRefresh")}</div>
            <div className="dnsinfo-card-value">{summary.lastRefresh}</div>
          </div>
          <div className="dnsinfo-card">
            <div className="dnsinfo-card-label">{t("label.dnssec")}</div>
            <div className="dnsinfo-card-value">
              <span className={`dnsinfo-badge ${summary.dnssecEnabled ? "success" : "warning"}`}>
                {summary.dnssecEnabled ? t("status.enabled") : t("status.disabled")}
              </span>
            </div>
          </div>
          <div className="dnsinfo-card">
            <div className="dnsinfo-card-label">{t("label.nameServers")}</div>
            <div className="dnsinfo-card-value">{summary.nameServers.join(", ")}</div>
          </div>
        </div>
      </div>

      {/* Records Summary */}
      <div className="dnsinfo-section">
        <h3 className="dnsinfo-section-title">{t("section.recordsSummary")}</h3>
        <div className="dnsinfo-records-grid">
          {Object.entries(summary.recordCounts).map(([type, count]) => (
            <div key={type} className="dnsinfo-record-item">
              <span className="dnsinfo-record-type">{type}</span>
              <span className="dnsinfo-record-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Email Configuration */}
      <div className="dnsinfo-section">
        <h3 className="dnsinfo-section-title">{t("section.emailConfig")}</h3>
        <div className="dnsinfo-email-grid">
          <div className="dnsinfo-email-item">
            <span className="dnsinfo-email-label">SPF</span>
            <span className={`dnsinfo-badge ${summary.hasSpf ? "success" : "error"}`}>
              {summary.hasSpf ? t("status.configured") : t("status.missing")}
            </span>
          </div>
          <div className="dnsinfo-email-item">
            <span className="dnsinfo-email-label">DKIM</span>
            <span className={`dnsinfo-badge ${summary.hasDkim ? "success" : "error"}`}>
              {summary.hasDkim ? t("status.configured") : t("status.missing")}
            </span>
          </div>
          <div className="dnsinfo-email-item">
            <span className="dnsinfo-email-label">DMARC</span>
            <span className={`dnsinfo-badge ${summary.hasDmarc ? "success" : "error"}`}>
              {summary.hasDmarc ? t("status.configured") : t("status.missing")}
            </span>
          </div>
          <div className="dnsinfo-email-item">
            <span className="dnsinfo-email-label">MX</span>
            <span className={`dnsinfo-badge ${summary.hasMx ? "success" : "error"}`}>
              {summary.hasMx ? t("status.configured") : t("status.missing")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DnsInfoTab;
