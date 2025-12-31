// ============================================================
// SUB-TAB - DNS Config (Configuration DNS email)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface DnsConfigTabProps {
  domain?: string;
}

interface DnsRecord {
  id: string;
  type: "MX" | "SPF" | "DKIM" | "DMARC" | "TXT" | "CNAME";
  name: string;
  value: string;
  priority?: number;
  ttl: number;
  status: "ok" | "warning" | "error" | "missing";
  recommended?: string;
}

/** Sous-onglet Configuration DNS pour les emails. */
export default function DnsConfigTab({ domain }: DnsConfigTabProps) {
  const { t } = useTranslation("web-cloud/emails/security");

  const [showRecommended, setShowRecommended] = useState(false);

  // Mock data - remplacer par appel API
  const dnsRecords: DnsRecord[] = useMemo(() => [
    {
      id: "1",
      type: "MX",
      name: "@",
      value: "mx1.mail.ovh.net",
      priority: 10,
      ttl: 3600,
      status: "ok",
    },
    {
      id: "2",
      type: "MX",
      name: "@",
      value: "mx2.mail.ovh.net",
      priority: 20,
      ttl: 3600,
      status: "ok",
    },
    {
      id: "3",
      type: "SPF",
      name: "@",
      value: "v=spf1 include:mx.ovh.com ~all",
      ttl: 3600,
      status: "ok",
    },
    {
      id: "4",
      type: "DKIM",
      name: "ovh-dkim._domainkey",
      value: "k=rsa; p=MIIBIj...",
      ttl: 3600,
      status: "ok",
    },
    {
      id: "5",
      type: "DMARC",
      name: "_dmarc",
      value: "v=DMARC1; p=none; rua=mailto:dmarc@example.com",
      ttl: 3600,
      status: "warning",
      recommended: "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com",
    },
    {
      id: "6",
      type: "CNAME",
      name: "autodiscover",
      value: "autodiscover.mail.ovh.net",
      ttl: 3600,
      status: "missing",
      recommended: "autodiscover.mail.ovh.net",
    },
  ], []);

  const statusCounts = useMemo(() => {
    return {
      ok: dnsRecords.filter((r) => r.status === "ok").length,
      warning: dnsRecords.filter((r) => r.status === "warning").length,
      error: dnsRecords.filter((r) => r.status === "error").length,
      missing: dnsRecords.filter((r) => r.status === "missing").length,
    };
  }, [dnsRecords]);

  const handleFixRecord = (record: DnsRecord) => {
    console.log("Fix DNS record", record.id);
  };

  const handleRefresh = () => {
    console.log("Refresh DNS records");
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      ok: "✓",
      warning: "⚠",
      error: "✗",
      missing: "○",
    };
    return icons[status] || "?";
  };

  return (
    <div className="dns-config-tab">
      {/* Summary banner */}
      <div className="dns-summary">
        <div className="dns-summary-item ok">
          <span className="count">{statusCounts.ok}</span>
          <span className="label">{t("dns.statusOk")}</span>
        </div>
        <div className="dns-summary-item warning">
          <span className="count">{statusCounts.warning}</span>
          <span className="label">{t("dns.statusWarning")}</span>
        </div>
        <div className="dns-summary-item error">
          <span className="count">{statusCounts.error + statusCounts.missing}</span>
          <span className="label">{t("dns.statusError")}</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleRefresh}>
          ↻ {t("dns.refresh")}
        </button>
      </div>

      {/* Info */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <p>{t("dns.info")}</p>
      </div>

      {/* Toggle recommended */}
      <div className="dns-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showRecommended}
            onChange={(e) => setShowRecommended(e.target.checked)}
          />
          {t("dns.showRecommended")}
        </label>
      </div>

      {/* DNS Records table */}
      <table className="emails-table dns-table">
        <thead>
          <tr>
            <th>{t("dns.type")}</th>
            <th>{t("dns.name")}</th>
            <th>{t("dns.value")}</th>
            <th>{t("dns.ttl")}</th>
            <th>{t("dns.status")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dnsRecords.map((record) => (
            <tr key={record.id} className={`dns-row ${record.status}`}>
              <td>
                <span className={`dns-type-badge ${record.type.toLowerCase()}`}>
                  {record.type}
                </span>
              </td>
              <td>
                <code className="dns-name">{record.name}</code>
              </td>
              <td>
                <div className="dns-value-cell">
                  <code className="dns-value">
                    {record.priority !== undefined && `${record.priority} `}
                    {record.value.length > 50
                      ? `${record.value.substring(0, 50)}...`
                      : record.value}
                  </code>
                  {showRecommended && record.recommended && (
                    <div className="dns-recommended">
                      <span className="recommended-label">{t("dns.recommended")}:</span>
                      <code>{record.recommended}</code>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <span className="dns-ttl">{record.ttl}s</span>
              </td>
              <td>
                <span className={`status-icon ${record.status}`}>
                  {getStatusIcon(record.status)}
                </span>
              </td>
              <td>
                {(record.status === "warning" || record.status === "error" || record.status === "missing") && (
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleFixRecord(record)}
                  >
                    {record.status === "missing" ? t("dns.add") : t("dns.fix")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
