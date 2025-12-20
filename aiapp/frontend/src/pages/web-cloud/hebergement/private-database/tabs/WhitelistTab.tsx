// ============================================================
// PRIVATE DB TAB: WHITELIST
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PrivateDatabaseWhitelist } from "../../../../../services/web-cloud.private-database";

interface Props { serviceName: string; }

export function WhitelistTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [whitelist, setWhitelist] = useState<PrivateDatabaseWhitelist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ips = await privateDatabaseService.listWhitelist(serviceName);
        const data = await Promise.all(ips.map(ip => privateDatabaseService.getWhitelist(serviceName, ip)));
        setWhitelist(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="whitelist-tab">
      <div className="tab-header"><h3>{t("whitelist.title")}</h3><p className="tab-description">{t("whitelist.description")}</p></div>
      {whitelist.length === 0 ? (
        <div className="empty-state"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg><p>{t("whitelist.empty")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("whitelist.ip")}</th><th>{t("whitelist.name")}</th><th>{t("whitelist.service")}</th><th>{t("whitelist.sftp")}</th><th>{t("whitelist.status")}</th></tr></thead>
          <tbody>
            {whitelist.map(w => (
              <tr key={w.ip}>
                <td className="font-mono">{w.ip}</td>
                <td>{w.name}</td>
                <td><span className={`badge ${w.service ? 'success' : 'inactive'}`}>{w.service ? '✓' : '✗'}</span></td>
                <td><span className={`badge ${w.sftp ? 'success' : 'inactive'}`}>{w.sftp ? '✓' : '✗'}</span></td>
                <td><span className={`badge ${w.status === 'created' ? 'success' : 'warning'}`}>{w.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WhitelistTab;
