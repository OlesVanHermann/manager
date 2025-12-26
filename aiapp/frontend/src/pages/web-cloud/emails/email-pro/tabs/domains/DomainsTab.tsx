// ============================================================
// EMAIL-PRO/DOMAINS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listDomains, getDomain } from "./DomainsTab.service";
import type { EmailProDomain } from "../../email-pro.types";
import "./DomainsTab.css";

interface Props { serviceName: string; }

export function DomainsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [domains, setDomains] = useState<EmailProDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await listDomains(serviceName);
        const data = await Promise.all(names.map(n => getDomain(serviceName, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="emailpro-domains-loading"><div className="emailpro-domains-skeleton" /></div>;

  return (
    <div className="emailpro-domains-tab">
      <div className="emailpro-domains-tab-header"><div><h3>{t("domains.title")}</h3><p className="emailpro-domains-tab-description">{t("domains.description")}</p></div></div>

      {domains.length === 0 ? (
        <div className="emailpro-domains-empty"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="emailpro-domains-cards">
          {domains.map(d => (
            <div key={d.name} className={`emailpro-domains-card ${d.domainValidated ? 'validated' : 'pending'}`}>
              <div className="emailpro-domains-header">
                <h4>{d.name}</h4>
                <span className={`emailpro-domains-badge ${d.state === 'ok' ? 'success' : 'warning'}`}>{d.state}</span>
              </div>
              <div className="emailpro-domains-checks">
                <div className={`emailpro-domains-check ${d.domainValidated ? 'valid' : 'invalid'}`}><span className="emailpro-domains-icon">{d.domainValidated ? '✓' : '✗'}</span> Domaine validé</div>
                <div className={`emailpro-domains-check ${d.mxIsValid ? 'valid' : 'invalid'}`}><span className="emailpro-domains-icon">{d.mxIsValid ? '✓' : '✗'}</span> MX configuré</div>
                <div className={`emailpro-domains-check ${d.srvIsValid ? 'valid' : 'invalid'}`}><span className="emailpro-domains-icon">{d.srvIsValid ? '✓' : '✗'}</span> SRV configuré</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
