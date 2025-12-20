// ============================================================
// TAB: DNS SERVERS - Serveurs DNS du domaine
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { domainsService, DnsServer } from "../../../../services/web-cloud.domains";

interface Props {
  domain: string;
}

const ServerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
    <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
  </svg>
);

/** Onglet serveurs DNS du domaine. */
export function DnsServersTab({ domain }: Props) {
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
        const details = await Promise.all(ids.map((id) => domainsService.getDnsServer(domain, id)));
        setServers(details);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domain]);

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dns-servers-tab">
      <div className="tab-header">
        <div>
          <h3>{t("dnsServers.title")}</h3>
          <p className="tab-description">{t("dnsServers.description")}</p>
        </div>
      </div>

      {servers.length === 0 ? (
        <div className="empty-state">
          <p>{t("dnsServers.empty")}</p>
        </div>
      ) : (
        <div className="dns-server-cards">
          {servers.map((server, index) => (
            <div key={server.id} className="dns-server-card">
              <div className="dns-server-icon">
                <ServerIcon />
              </div>
              <div className="dns-server-info">
                <h4>{server.host}</h4>
                <p>Serveur DNS {index + 1} {server.isUsed && <span className="badge success">Actif</span>}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("dnsServers.info")}</h4>
        <p>{t("dnsServers.infoDesc")}</p>
      </div>
    </div>
  );
}

export default DnsServersTab;
