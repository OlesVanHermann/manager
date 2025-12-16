// ============================================================
// TAB: ZONE DNS - Enregistrements DNS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DnsRecord } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA', 'DKIM', 'SPF', 'DMARC'];

/** Onglet Zone DNS - Gestion des enregistrements. */
export function ZoneTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const { t: tCommon } = useTranslation("common");

  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterSubdomain, setFilterSubdomain] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  // ---------- LOAD RECORDS ----------
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await domainsService.listZoneRecords(domain, filterType || undefined, undefined);
      // Streaming: charge par batch de 10
      const allRecords: DnsRecord[] = [];
      for (let i = 0; i < ids.length; i += 10) {
        const batch = ids.slice(i, i + 10);
        const batchRecords = await Promise.all(batch.map(id => domainsService.getZoneRecord(domain, id)));
        allRecords.push(...batchRecords);
        setRecords([...allRecords]);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [domain, filterType]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  // ---------- REFRESH ZONE ----------
  const handleRefreshZone = async () => {
    try {
      setRefreshing(true);
      await domainsService.refreshZone(domain);
      await loadRecords();
    } catch (err) {
      setError(String(err));
    } finally {
      setRefreshing(false);
    }
  };

  // ---------- FILTERED RECORDS ----------
  const filteredRecords = records.filter(r => {
    if (filterSubdomain && !r.subDomain.toLowerCase().includes(filterSubdomain.toLowerCase())) return false;
    return true;
  });

  // ---------- RENDER ----------
  if (loading && records.length === 0) {
    return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;
  }

  return (
    <div className="zone-tab">
      <div className="tab-header">
        <div>
          <h3>{t("zone.title")}</h3>
          <p className="tab-description">{t("zone.description")}</p>
        </div>
        <button className="btn-primary" onClick={handleRefreshZone} disabled={refreshing}>
          {refreshing ? tCommon("loading") : t("zone.refresh")}
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-row">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
          <option value="">{t("zone.allTypes")}</option>
          {RECORD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <input
          type="text"
          placeholder={t("zone.filterSubdomain")}
          value={filterSubdomain}
          onChange={(e) => setFilterSubdomain(e.target.value)}
          className="filter-input"
        />
        <span className="records-count">{filteredRecords.length} {t("zone.records")}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {filteredRecords.length === 0 ? (
        <div className="empty-state">{t("zone.empty")}</div>
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
            {filteredRecords.map(record => (
              <tr key={record.id}>
                <td><span className={`record-type type-${record.fieldType.toLowerCase()}`}>{record.fieldType}</span></td>
                <td className="font-mono">{record.subDomain || '@'}</td>
                <td className="font-mono target-cell">{record.target}</td>
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
