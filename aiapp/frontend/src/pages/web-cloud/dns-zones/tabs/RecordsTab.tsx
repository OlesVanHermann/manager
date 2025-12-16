// ============================================================
// DNS ZONES TAB: RECORDS - Enregistrements DNS
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { dnsZonesService, DnsZoneRecord } from "../../../../services/dns-zones.service";

interface Props { zoneName: string; }

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV', 'CAA', 'DKIM', 'SPF', 'DMARC', 'PTR'];

export function RecordsTab({ zoneName }: Props) {
  const { t } = useTranslation("web-cloud/dns-zones/index");
  const { t: tCommon } = useTranslation("common");
  const [records, setRecords] = useState<DnsZoneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("");
  const [filterSubdomain, setFilterSubdomain] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ids = await dnsZonesService.listRecords(zoneName, filterType || undefined);
      const all: DnsZoneRecord[] = [];
      for (let i = 0; i < ids.length; i += 10) {
        const batch = ids.slice(i, i + 10);
        const data = await Promise.all(batch.map(id => dnsZonesService.getRecord(zoneName, id)));
        all.push(...data);
        setRecords([...all]);
      }
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [zoneName, filterType]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const handleRefresh = async () => {
    try { setRefreshing(true); await dnsZonesService.refreshZone(zoneName); await loadRecords(); }
    catch (err) { setError(String(err)); }
    finally { setRefreshing(false); }
  };

  const filtered = records.filter(r => !filterSubdomain || r.subDomain.toLowerCase().includes(filterSubdomain.toLowerCase()));

  if (loading && records.length === 0) return <div className="tab-loading"><div className="skeleton-block" /><div className="skeleton-block" /></div>;

  return (
    <div className="records-tab">
      <div className="tab-header">
        <div><h3>{t("records.title")}</h3><p className="tab-description">{t("records.description")}</p></div>
        <button className="btn-primary" onClick={handleRefresh} disabled={refreshing}>{refreshing ? tCommon("loading") : t("records.refresh")}</button>
      </div>
      <div className="filters-row">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
          <option value="">{t("records.allTypes")}</option>
          {RECORD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <input type="text" placeholder={t("records.filterSubdomain")} value={filterSubdomain} onChange={(e) => setFilterSubdomain(e.target.value)} className="filter-input" />
        <span className="records-count">{filtered.length} {t("records.count")}</span>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>{t("records.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("records.type")}</th><th>{t("records.subdomain")}</th><th>{t("records.target")}</th><th>{t("records.ttl")}</th></tr></thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td><span className={`record-type type-${r.fieldType.toLowerCase()}`}>{r.fieldType}</span></td>
                <td className="font-mono">{r.subDomain || '@'}</td>
                <td className="font-mono target-cell">{r.target}</td>
                <td>{r.ttl}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RecordsTab;
