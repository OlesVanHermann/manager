// ============================================================
// OFFICE/DOMAINS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listDomains, getDomain } from "./DomainsTab.service";
import type { OfficeDomain } from "../../office.types";
import "./DomainsTab.css";

interface Props { tenantId: string; }

export function DomainsTab({ tenantId }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [domains, setDomains] = useState<OfficeDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await listDomains(tenantId);
        const data = await Promise.all(names.map(n => getDomain(tenantId, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [tenantId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="office-domains-tab">
      <div className="office-domains-tab-header"><div><h3>{t("domains.title")}</h3></div></div>
      {domains.length === 0 ? (
        <div className="office-domains-empty"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="office-domains-cards">
          {domains.map(d => (
            <div key={d.domainName} className={`office-domains-card ${d.status === 'ok' ? 'validated' : 'pending'}`}>
              <div className="office-domains-header">
                <h4>{d.domainName}</h4>
                <span className={`badge ${d.status === 'ok' ? 'success' : 'warning'}`}>{d.status}</span>
              </div>
              {d.txtEntry && d.status !== 'ok' && (
                <div className="office-domains-txt">
                  <strong>TXT requis:</strong>{d.txtEntry}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DomainsTab;
