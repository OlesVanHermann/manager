// ============================================================
// EXCHANGE TAB: GROUPS (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeGroup } from "../../../../../services/web-cloud.exchange";

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
        const names = await exchangeService.listGroups(org, service);
        const data = await Promise.all(names.map(n => exchangeService.getGroup(org, service, n)));
        setGroups(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="groups-tab">
      <div className="tab-header"><div><h3>{t("groups.title")}</h3></div><span className="records-count">{groups.length}</span></div>
      {groups.length === 0 ? (
        <div className="empty-state"><p>{t("groups.empty")}</p></div>
      ) : (
        <div className="group-cards">
          {groups.map(g => (
            <div key={g.mailingListAddress} className="group-card">
              <div className="group-icon">👥</div>
              <h4>{g.displayName}</h4>
              <p className="email">{g.mailingListAddress}</p>
              <div className="group-meta">
                <span className={`badge ${g.state === 'ok' ? 'success' : 'warning'}`}>{g.state}</span>
                <span className="badge info">{g.memberCount || 0} membres</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupsTab;
