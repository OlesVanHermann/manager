// ============================================================
// ZIMBRA/DOMAINS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listDomains, getDomain } from "./DomainsTab.service";
import type { ZimbraDomain } from "../../zimbra.types";
import "./DomainsTab.css";

interface Props { serviceId: string; }

export function DomainsTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [domains, setDomains] = useState<ZimbraDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listDomains(serviceId);
        const data = await Promise.all(ids.map(id => getDomain(serviceId, id)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="zimbra-domains-loading"><div className="zimbra-domains-skeleton" /></div>;

  return (
    <div className="zimbra-domains-tab">
      <div className="zimbra-domains-tab-header"><div><h3>{t("domains.title")}</h3></div></div>
      {domains.length === 0 ? (
        <div className="zimbra-domains-empty"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="zimbra-domains-cards">
          {domains.map(d => (
            <div key={d.id} className={`zimbra-domains-card ${d.status === 'ok' ? 'validated' : ''}`}>
              <div className="zimbra-domains-header">
                <h4>{d.name}</h4>
                <span className={`badge ${d.status === 'ok' ? 'success' : 'warning'}`}>{d.status}</span>
              </div>
              <div className="zimbra-domains-checks">
                <div className="zimbra-domains-check"><span className="icon">📧</span> Type: {d.type}</div>
                {d.cnameToCheck && <div className="zimbra-domains-check invalid"><span className="icon">⚠</span> CNAME requis</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
