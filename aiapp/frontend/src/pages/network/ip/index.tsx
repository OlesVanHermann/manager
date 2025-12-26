// ============================================================
// IP - Page principale (SANS dépendance à IpPage.ts)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ovhGet } from "../../../services/api";
import type { IpBlock } from "./ip.types";
import "./IpPage.css";

// ==================== API CALLS LOCAUX ====================

async function listIps(): Promise<string[]> {
  return ovhGet<string[]>("/ip");
}

async function getIp(ip: string): Promise<IpBlock> {
  return ovhGet<IpBlock>(`/ip/${encodeURIComponent(ip)}`);
}

// ==================== COMPOSANT ====================

export default function IpPage() {
  const { t } = useTranslation("network/ip/page");
  const { t: tCommon } = useTranslation("common");
  const [ips, setIps] = useState<{ ip: string; details?: IpBlock; loading: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const loadIps = useCallback(async () => {
    try {
      setLoading(true);
      const ipList = await listIps();
      const list = ipList.map(ip => ({ ip, loading: true }));
      setIps(list);
      for (let i = 0; i < ipList.length; i += 10) {
        const batch = ipList.slice(i, i + 10);
        await Promise.all(batch.map(async (ip) => {
          try {
            const details = await getIp(ip);
            setIps(prev => prev.map(item => item.ip === ip ? { ...item, details, loading: false } : item));
          } catch {
            setIps(prev => prev.map(item => item.ip === ip ? { ...item, loading: false } : item));
          }
        }));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIps();
  }, [loadIps]);

  const filtered = ips.filter(item => {
    const matchSearch = item.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details?.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || item.details?.type === filterType;
    return matchSearch && matchType;
  });

  const ipTypes = [...new Set(ips.map(i => i.details?.type).filter(Boolean))];

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      dedicated: "info",
      failover: "success",
      vps: "warning",
      cloud: "primary",
      vrack: "secondary"
    };
    return <span className={`ip-badge ${colors[type] || "inactive"}`}>{type}</span>;
  };

  return (
    <div className="ip-page">
      <header className="ip-header">
        <div>
          <h1>{t("title")}</h1>
          <p className="ip-description">{t("description")}</p>
        </div>
        <button className="btn-refresh" onClick={loadIps}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {tCommon("actions.refresh")}
        </button>
      </header>

      <div className="ip-filters">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ip-search"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="ip-select"
        >
          <option value="all">{t("filters.allTypes")}</option>
          {ipTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <span className="ip-count">{filtered.length} / {ips.length}</span>
      </div>

      <div className="ip-content">
        {loading && ips.length === 0 ? (
          <div className="ip-loading">
            <div className="ip-skeleton" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="ip-empty">
            <p>{t("empty")}</p>
          </div>
        ) : (
          <table className="ip-table">
            <thead>
              <tr>
                <th>{t("table.ip")}</th>
                <th>{t("table.type")}</th>
                <th>{t("table.description")}</th>
                <th>{t("table.routedTo")}</th>
                <th>{t("table.country")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.ip}>
                  <td className="ip-cell-mono">{item.ip}</td>
                  <td>{item.details ? getTypeBadge(item.details.type) : "-"}</td>
                  <td>{item.details?.description || "-"}</td>
                  <td className="ip-cell-mono">{item.details?.routedTo?.serviceName || "-"}</td>
                  <td>{item.details?.country || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
