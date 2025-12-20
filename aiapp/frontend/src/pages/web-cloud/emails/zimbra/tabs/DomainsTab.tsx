// ============================================================
// ZIMBRA TAB: DOMAINS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraDomain } from "../../../../../services/web-cloud.zimbra";

interface Props { serviceId: string; }

/** Onglet Domaines Zimbra. */
export function DomainsTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [domains, setDomains] = useState<ZimbraDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await zimbraService.listDomains(serviceId);
        const data = await Promise.all(ids.map(id => zimbraService.getDomain(serviceId, id)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><div><h3>{t("domains.title")}</h3></div></div>
      {domains.length === 0 ? (
        <div className="empty-state"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="domain-cards">
          {domains.map(d => (
            <div key={d.id} className={`domain-card ${d.status === 'ok' ? 'validated' : ''}`}>
              <div className="domain-header">
                <h4>{d.name}</h4>
                <span className={`badge ${d.status === 'ok' ? 'success' : 'warning'}`}>{d.status}</span>
              </div>
              <div className="domain-checks">
                <div className="domain-check"><span className="icon">📧</span> Type: {d.type}</div>
                {d.cnameToCheck && <div className="domain-check invalid"><span className="icon">⚠</span> CNAME requis</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
