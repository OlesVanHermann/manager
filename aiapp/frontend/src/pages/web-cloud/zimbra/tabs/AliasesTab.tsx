import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraAlias } from "../../../../services/zimbra.service";

interface Props { serviceId: string; }

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
      <div className="tab-header"><h3>{t("aliases.title")}</h3></div>
      {aliases.length === 0 ? (<div className="empty-state"><p>{t("aliases.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("aliases.alias")}</th><th>{t("aliases.target")}</th><th>{t("aliases.status")}</th></tr></thead>
          <tbody>
            {aliases.map(a => (
              <tr key={a.id}>
                <td className="font-mono">{a.alias}</td>
                <td className="font-mono">{a.targetAccountId}</td>
                <td><span className={`badge ${a.status === 'ok' ? 'success' : 'warning'}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default AliasesTab;
