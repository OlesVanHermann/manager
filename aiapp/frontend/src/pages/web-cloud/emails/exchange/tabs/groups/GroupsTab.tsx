// ============================================================
// EXCHANGE/GROUPS TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listGroups, getGroup } from "./GroupsTab.service";
import type { ExchangeGroup } from "../../exchange.types";
import "./GroupsTab.css";

interface Props { org: string; service: string; }

/** Onglet Groupes de distribution Exchange. */
export function GroupsTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [groups, setGroups] = useState<ExchangeGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await listGroups(org, service);
        const data = await Promise.all(names.map(n => getGroup(org, service, n)));
        setGroups(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="exchange-groups-tab">
      <div className="exchange-groups-tab-header"><div><h3>{t("groups.title")}</h3></div><span className="exchange-groups-records-count">{groups.length}</span></div>
      {groups.length === 0 ? (
        <div className="exchange-groups-empty"><p>{t("groups.empty")}</p></div>
      ) : (
        <div className="exchange-groups-cards">
          {groups.map(g => (
            <div key={g.mailingListAddress} className="exchange-groups-card">
              <div className="exchange-groups-icon">👥</div>
              <h4>{g.displayName}</h4>
              <p className="exchange-groups-email">{g.mailingListAddress}</p>
              <div className="exchange-groups-meta">
                <span className={`badge ${g.state === 'ok' ? 'success' : 'warning'}`}>{g.state}</span>
                <span className="badge info">{g.memberCount || g.members?.length || 0} membres</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupsTab;
