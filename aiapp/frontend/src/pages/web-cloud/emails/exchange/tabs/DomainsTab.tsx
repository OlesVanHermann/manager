// ============================================================
// EXCHANGE TAB: DOMAINS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeDomain } from "../../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

/** Onglet Domaines Exchange. */
export function DomainsTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [domains, setDomains] = useState<ExchangeDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await exchangeService.listDomains(org, service);
        const data = await Promise.all(names.map(n => exchangeService.getDomain(org, service, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><div><h3>{t("domains.title")}</h3></div></div>
      {domains.length === 0 ? (
        <div className="empty-state"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="domain-cards">
          {domains.map(d => (
            <div key={d.name} className={`domain-card ${d.main ? 'main' : ''}`}>
              <div className="domain-header">
                <h4>{d.name}</h4>
                {d.main && <span className="main-badge">Principal</span>}
              </div>
              <div className="domain-checks">
                <div className={`domain-check ${d.state === 'ok' ? 'valid' : 'invalid'}`}><span className="icon">{d.state === 'ok' ? '✓' : '✗'}</span> État: {d.state}</div>
                <div className={`domain-check ${d.mxIsValid ? 'valid' : 'invalid'}`}><span className="icon">{d.mxIsValid ? '✓' : '✗'}</span> MX</div>
                <div className={`domain-check ${d.srvIsValid ? 'valid' : 'invalid'}`}><span className="icon">{d.srvIsValid ? '✓' : '✗'}</span> SRV</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
