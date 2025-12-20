// ============================================================
// OFFICE TAB: DOMAINS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { officeService, OfficeDomain } from "../../../../../services/web-cloud.office";

interface Props { tenantId: string; }

/** Onglet Domaines Office 365. */
export function DomainsTab({ tenantId }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [domains, setDomains] = useState<OfficeDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await officeService.listDomains(tenantId);
        const data = await Promise.all(names.map(n => officeService.getDomain(tenantId, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [tenantId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><div><h3>{t("domains.title")}</h3></div></div>
      {domains.length === 0 ? (
        <div className="empty-state"><p>{t("domains.empty")}</p></div>
      ) : (
        <div className="domain-cards">
          {domains.map(d => (
            <div key={d.domainName} className={`domain-card ${d.status === 'ok' ? 'validated' : 'pending'}`}>
              <div className="domain-header">
                <h4>{d.domainName}</h4>
                <span className={`badge ${d.status === 'ok' ? 'success' : 'warning'}`}>{d.status}</span>
              </div>
              {d.txtEntry && d.status !== 'ok' && (
                <div className="domain-txt">
                  <strong>TXT requis:</strong><br/>{d.txtEntry}
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
