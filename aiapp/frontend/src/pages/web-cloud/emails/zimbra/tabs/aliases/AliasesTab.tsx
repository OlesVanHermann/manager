// ============================================================
// ZIMBRA/ALIASES TAB - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { listAliases, getAlias } from "./AliasesTab.service";
import type { ZimbraAlias } from "../../zimbra.types";
import "./AliasesTab.css";

interface Props { serviceId: string; }

export function AliasesTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [aliases, setAliases] = useState<ZimbraAlias[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await listAliases(serviceId);
        const data = await Promise.all(ids.map(id => getAlias(serviceId, id)));
        setAliases(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="zimbra-aliases-tab">
      <div className="zimbra-aliases-tab-header">
        <div><h3>{t("aliases.title")}</h3><p className="zimbra-aliases-tab-description">{t("aliases.description")}</p></div>
        <span className="zimbra-aliases-records-count">{aliases.length}</span>
      </div>
      {aliases.length === 0 ? (
        <div className="zimbra-aliases-empty"><p>{t("aliases.empty")}</p></div>
      ) : (
        <div className="zimbra-aliases-cards">
          {aliases.map(a => (
            <div key={a.id} className="zimbra-aliases-card">
              <div className="zimbra-aliases-flow">
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
