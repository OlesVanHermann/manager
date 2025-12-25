// ============================================================
// EXCHANGE/RESOURCES TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listResources, getResource } from "./ResourcesTab.ts";
import type { ExchangeResource } from "../../exchange.types";
import "./ResourcesTab.css";

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
        const emails = await listResources(org, service);
        const data = await Promise.all(emails.map(e => getResource(org, service, e)));
        setResources(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="exchange-resources-tab">
      <div className="exchange-resources-tab-header"><div><h3>{t("resources.title")}</h3></div><span className="exchange-resources-records-count">{resources.length}</span></div>
      {resources.length === 0 ? (
        <div className="exchange-resources-empty"><p>{t("resources.empty")}</p></div>
      ) : (
        <div className="exchange-resources-cards">
          {resources.map(r => (
            <div key={r.resourceEmailAddress} className="exchange-resources-card">
              <div className={`exchange-resources-icon ${r.type === 'room' ? 'room' : 'equipment'}`}>{r.type === 'room' ? '🏢' : '📦'}</div>
              <h4>{r.displayName}</h4>
              <p className="exchange-resources-email">{r.resourceEmailAddress}</p>
              <div className="exchange-resources-meta">
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
