// ============================================================
// TAB: DNS - Serveurs DNS du domaine
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DnsServer } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

/** Onglet serveurs DNS du domaine. */
export function DnsTab({ domain }: Props) {
  const { t } = useTranslation("web-cloud/domains/index");
  const [servers, setServers] = useState<DnsServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const ids = await domainsService.listDnsServers(domain);
        const details = await Promise.all(ids.map(id => domainsService.getDnsServer(domain, id)));
        setServers(details);
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
    <div className="dns-tab">
      <div className="tab-header">
        <h3>{t("dns.title")}</h3>
        <p className="tab-description">{t("dns.description")}</p>
      </div>

      {servers.length === 0 ? (
        <div className="empty-state">{t("dns.empty")}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("dns.server")}</th>
              <th>{t("dns.ip")}</th>
              <th>{t("dns.status")}</th>
            </tr>
          </thead>
          <tbody>
            {servers.map(server => (
              <tr key={server.id}>
                <td className="font-mono">{server.host}</td>
                <td className="font-mono">{server.ip || '-'}</td>
                <td>
                  <span className={`badge ${server.isUsed ? "success" : "inactive"}`}>
                    {server.isUsed ? t("dns.active") : t("dns.inactive")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DnsTab;
