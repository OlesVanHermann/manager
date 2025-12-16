// ============================================================
// TAB: DYNHOST - DNS Dynamique
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DynHostRecord } from "../../../../services/domains.service";

interface Props {
  domain: string;
}

/** Onglet DynHost - Gestion du DNS dynamique. */
export function DynHostTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const [records, setRecords] = useState<DynHostRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await domainsService.listDynHostRecords(domain);
        const details = await Promise.all(ids.map(id => domainsService.getDynHostRecord(domain, id)));
        setRecords(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dynhost-tab">
      <div className="tab-header">
        <div>
          <h3>{t("dynhost.title")}</h3>
          <p className="tab-description">{t("dynhost.description")}</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <p>{t("dynhost.empty")}</p>
          <span className="empty-hint">{t("dynhost.emptyHint")}</span>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("dynhost.subdomain")}</th>
              <th>{t("dynhost.ip")}</th>
              <th>{t("dynhost.login")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td className="font-mono">{record.subDomain || '@'}.{record.zone}</td>
                <td className="font-mono"><span className="ip-badge">{record.ip}</span></td>
                <td>{record.login || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="info-box">
        <h4>{t("dynhost.whatIs")}</h4>
        <p>{t("dynhost.explanation")}</p>
        <div className="code-block">
          <code>curl -X PUT "https://www.ovh.com/nic/update?system=dyndns&hostname=sub.{domain}&myip=YOUR_IP" -u "login:password"</code>
        </div>
      </div>
    </div>
  );
}

export default DynHostTab;
