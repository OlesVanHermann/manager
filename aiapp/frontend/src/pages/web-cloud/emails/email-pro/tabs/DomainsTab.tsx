// ============================================================
// EMAIL PRO TAB: DOMAINS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { emailProService, EmailProDomain } from "../../../../../services/web-cloud.email-pro";

interface Props { serviceName: string; }

/** Onglet Domaines Email Pro. */
export function DomainsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/email-pro/index");
  const [domains, setDomains] = useState<EmailProDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await emailProService.listDomains(serviceName);
        const data = await Promise.all(names.map(n => emailProService.getDomain(serviceName, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><div><h3>{t("domains.title")}</h3><p className="tab-description">{t("domains.description")}</p></div></div>

      {domains.length === 0 ? (
        <div className="empty-state"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="domain-cards">
          {domains.map(d => (
            <div key={d.name} className={`domain-card ${d.domainValidated ? 'validated' : 'pending'}`}>
              <div className="domain-header">
                <h4>{d.name}</h4>
                <span className={`badge ${d.state === 'ok' ? 'success' : 'warning'}`}>{d.state}</span>
              </div>
              <div className="domain-checks">
                <div className={`domain-check ${d.domainValidated ? 'valid' : 'invalid'}`}><span className="icon">{d.domainValidated ? '✓' : '✗'}</span> Domaine validé</div>
                <div className={`domain-check ${d.mxIsValid ? 'valid' : 'invalid'}`}><span className="icon">{d.mxIsValid ? '✓' : '✗'}</span> MX configuré</div>
                <div className={`domain-check ${d.srvIsValid ? 'valid' : 'invalid'}`}><span className="icon">{d.srvIsValid ? '✓' : '✗'}</span> SRV configuré</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
