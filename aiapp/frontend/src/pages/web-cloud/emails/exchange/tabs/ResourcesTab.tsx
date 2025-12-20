// ============================================================
// EXCHANGE TAB: RESOURCES (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeResource } from "../../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

/** Onglet Ressources Exchange (salles, equipements). */
export function ResourcesTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [resources, setResources] = useState<ExchangeResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emails = await exchangeService.listResources(org, service);
        const data = await Promise.all(emails.map(e => exchangeService.getResource(org, service, e)));
        setResources(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="resources-tab">
      <div className="tab-header"><div><h3>{t("resources.title")}</h3></div><span className="records-count">{resources.length}</span></div>
      {resources.length === 0 ? (
        <div className="empty-state"><p>{t("resources.empty")}</p></div>
      ) : (
        <div className="resource-cards">
          {resources.map(r => (
            <div key={r.resourceEmailAddress} className="resource-card">
              <div className={`resource-icon ${r.type === 'room' ? 'room' : 'equipment'}`}>{r.type === 'room' ? '🏢' : '📦'}</div>
              <h4>{r.displayName}</h4>
              <p className="email">{r.resourceEmailAddress}</p>
              <div className="resource-meta">
                <span className={`badge ${r.state === 'ok' ? 'success' : 'warning'}`}>{r.state}</span>
                {r.capacity && <span className="badge info">{r.capacity} places</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourcesTab;
