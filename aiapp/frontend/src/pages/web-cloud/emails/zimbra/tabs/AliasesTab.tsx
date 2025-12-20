// ============================================================
// ZIMBRA TAB: ALIASES (style Hosting)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraAlias } from "../../../../../services/web-cloud.zimbra";

interface Props { serviceId: string; }

/** Onglet Alias Zimbra. */
export function AliasesTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [aliases, setAliases] = useState<ZimbraAlias[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await zimbraService.listAliases(serviceId);
        const data = await Promise.all(ids.map(id => zimbraService.getAlias(serviceId, id)));
        setAliases(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="aliases-tab">
      <div className="tab-header"><div><h3>{t("aliases.title")}</h3><p className="tab-description">{t("aliases.description")}</p></div><span className="records-count">{aliases.length}</span></div>
      {aliases.length === 0 ? (
        <div className="empty-state"><p>{t("aliases.empty")}</p></div>
      ) : (
        <div className="alias-cards">
          {aliases.map(a => (
            <div key={a.id} className="alias-card">
              <div className="alias-flow">
                <span className="from">{a.alias}</span>
                <span className="arrow">→</span>
                <span className="to">{a.targetAccountId}</span>
              </div>
              <span className={`badge ${a.status === 'ok' ? 'success' : 'warning'}`}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AliasesTab;
