// ============================================================
// EXCHANGE/DOMAINS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listDomains, getDomain } from "./DomainsTab.ts";
import type { ExchangeDomain } from "../../exchange.types";
import "./DomainsTab.css";

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
        const names = await listDomains(org, service);
        const data = await Promise.all(names.map(n => getDomain(org, service, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="exchange-domains-tab">
      <div className="exchange-domains-tab-header"><div><h3>{t("domains.title")}</h3></div></div>
      {domains.length === 0 ? (
        <div className="exchange-domains-empty"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="exchange-domains-cards">
          {domains.map(d => (
            <div key={d.name} className={`exchange-domains-card ${d.main ? 'main' : ''}`}>
              <div className="exchange-domains-header">
                <h4>{d.name}</h4>
                {d.main && <span className="exchange-domains-main-badge">Principal</span>}
              </div>
              <div className="exchange-domains-checks">
                <div className={`exchange-domains-check ${d.state === 'ok' ? 'valid' : 'invalid'}`}><span className="icon">{d.state === 'ok' ? '✓' : '✗'}</span> État: {d.state}</div>
                <div className={`exchange-domains-check ${d.mxIsValid ? 'valid' : 'invalid'}`}><span className="icon">{d.mxIsValid ? '✓' : '✗'}</span> MX</div>
                <div className={`exchange-domains-check ${d.srvIsValid ? 'valid' : 'invalid'}`}><span className="icon">{d.srvIsValid ? '✓' : '✗'}</span> SRV</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
