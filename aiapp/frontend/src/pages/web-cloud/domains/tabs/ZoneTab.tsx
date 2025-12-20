// ============================================================
// TAB: ZONE DNS - Enregistrements DNS + Historique (toggle)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dnsZonesService, DnsZoneRecord } from "../../../../services/web-cloud.dns-zones";

interface Props {
  zoneName: string;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV", "CAA", "DKIM", "SPF", "DMARC", "PTR"];

/** Onglet Zone DNS - Gestion des enregistrements + historique. */
export function ZoneTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE VIEW ----------
  const [view, setView] = useState<"records" | "history">("records");

  // ---------- STATE RECORDS ----------
  const [records, setRecords] = useState<DnsZoneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterSubdomain, setFilterSubdomain] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // ---------- STATE HISTORY ----------
  const [history, setHistory] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  // ---------- LOAD RECORDS ----------
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setRecords([]);
      setLoadedCount(0);
      const ids = await dnsZonesService.listRecords(zoneName, filterType || undefined);
      setTotalCount(ids.length);
      const all: DnsZoneRecord[] = [];
      for (let i = 0; i < ids.length; i += 10) {
        const batch = ids.slice(i, i + 10);
        const data = await Promise.all(batch.map((id) => dnsZonesService.getRecord(zoneName, id)));
        all.push(...data);
        setRecords([...all]);
        setLoadedCount(all.length);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [zoneName, filterType]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ---------- LOAD HISTORY ----------
  const loadHistory = async () => {
    if (historyLoaded) return;
    try {
      setHistoryLoading(true);
      const dates = await dnsZonesService.listHistory(zoneName);
      setHistory(dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));
      setHistoryLoaded(true);
    } catch (err) {
      console.error("Failed to load history:", err);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // ---------- SWITCH TO HISTORY ----------
  const handleShowHistory = () => {
    setView("history");
    loadHistory();
  };

  // ---------- REFRESH ZONE ----------
  const handleRefreshZone = async () => {
    try {
      setRefreshing(true);
      await dnsZonesService.refreshZone(zoneName);
      await loadRecords();
    } catch (err) {
      setError(String(err));
    } finally {
      setRefreshing(false);
    }
  };

  // ---------- RESTORE HISTORY ----------
  const handleRestore = async (createdAt: string) => {
    if (!confirm(t("history.confirmRestore"))) return;
    try {
      setRestoring(createdAt);
      await dnsZonesService.restoreHistory(zoneName, createdAt);
      alert(t("history.restored"));
      setHistoryLoaded(false);
      setView("records");
      await loadRecords();
    } catch (err) {
      alert(String(err));
    } finally {
      setRestoring(null);
    }
  };

  // ---------- FILTERED RECORDS ----------
  const filteredRecords = records.filter((r) => {
    if (filterSubdomain && !r.subDomain.toLowerCase().includes(filterSubdomain.toLowerCase())) return false;
    return true;
  });

  // ---------- FORMAT DATE ----------
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------- RENDER HISTORY VIEW ----------
  if (view === "history") {
    return (
      <div className="zone-tab">
        <div className="tab-header">
          <div>
            <h3>{t("history.title")}</h3>
            <p className="tab-description">{t("history.description")}</p>
          </div>
          <button className="btn-secondary" onClick={() => setView("records")}>
            ← {t("zone.backToRecords")}
          </button>
        </div>

        {historyLoading ? (
          <div className="tab-loading">
            <div className="skeleton-block" />
            <div className="skeleton-block" />
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <p>{t("history.empty")}</p>
          </div>
        ) : (
          <div className="history-timeline">
            {history.map((date, index) => (
              <div key={date} className="history-item">
                <div className="history-dot" />
                <div className="history-content">
                  <div className="history-info">
                    <div className="history-date">{formatDate(date)}</div>
                    {index === 0 && <span className="badge success">{t("history.current")}</span>}
                  </div>
                  {index > 0 && (
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => handleRestore(date)}
                      disabled={restoring === date}
                    >
                      {restoring === date ? tCommon("loading") : t("history.restore")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="info-box">
          <h4>{t("history.info")}</h4>
          <p>{t("history.infoDesc")}</p>
        </div>
      </div>
    );
  }

  // ---------- RENDER RECORDS VIEW ----------
  if (loading && records.length === 0) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="zone-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("zone.title")}</h3>
          <p className="tab-description">{t("zone.description")}</p>
        </div>
        <div className="tab-header-actions">
          <button className="btn-secondary" onClick={handleShowHistory}>
            📜 {t("zone.history")}
          </button>
          <button className="btn-primary" onClick={handleRefreshZone} disabled={refreshing}>
            {refreshing ? tCommon("loading") : t("zone.refresh")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="zone-stats">
        <div className="stat-card">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">{t("zone.totalRecords")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{records.filter((r) => r.fieldType === "A").length}</div>
          <div className="stat-label">A</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{records.filter((r) => r.fieldType === "CNAME").length}</div>
          <div className="stat-label">CNAME</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{records.filter((r) => r.fieldType === "MX").length}</div>
          <div className="stat-label">MX</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{records.filter((r) => r.fieldType === "TXT").length}</div>
          <div className="stat-label">TXT</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-row">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
          <option value="">{t("zone.allTypes")}</option>
          {RECORD_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder={t("zone.filterSubdomain")}
          value={filterSubdomain}
          onChange={(e) => setFilterSubdomain(e.target.value)}
          className="filter-input"
        />
        <span className="records-count">
          {loading ? `${loadedCount}/${totalCount}` : `${filteredRecords.length}`} {t("zone.records")}
        </span>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Records table */}
      {filteredRecords.length === 0 && !loading ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
          </svg>
          <p>{t("zone.empty")}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("zone.type")}</th>
              <th>{t("zone.subdomain")}</th>
              <th>{t("zone.target")}</th>
              <th>{t("zone.ttl")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td><span className={`record-type type-${record.fieldType.toLowerCase()}`}>{record.fieldType}</span></td>
                <td className="font-mono">{record.subDomain || "@"}</td>
                <td className="font-mono target-cell" title={record.target}>{record.target}</td>
                <td>{record.ttl}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ZoneTab;
