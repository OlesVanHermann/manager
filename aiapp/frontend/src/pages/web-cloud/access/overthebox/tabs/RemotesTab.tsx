import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { overtheboxService, Remote } from "../../../../../services/web-cloud.overthebox";

interface Props { serviceName: string; }

export function RemotesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/overthebox/index");
  const [remotes, setRemotes] = useState<Remote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await overtheboxService.getRemotes(serviceName); setRemotes(data); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="remotes-tab">
      <div className="tab-header"><div><h3>{t("remotes.title")}</h3><p className="tab-description">{t("remotes.description")}</p></div></div>
      {remotes.length === 0 ? (
        <div className="empty-state"><p>{t("remotes.empty")}</p></div>
      ) : (
        <div className="remote-cards">
          {remotes.map(r => (
            <div key={r.remoteId} className={`remote-card ${r.status === 'active' ? 'active' : 'inactive'}`}>
              <div className="remote-header">
                <h4>{r.remoteId}</h4>
                <span className={`badge ${r.status === 'active' ? 'success' : 'inactive'}`}>{r.status}</span>
              </div>
              <div className="remote-info">
                <label>{t("remotes.ip")}</label><span>{r.publicIp || '-'}</span>
                <label>{t("remotes.port")}</label><span>{r.exposedPort}</span>
                <label>{t("remotes.lastSeen")}</label><span>{r.lastSeen ? new Date(r.lastSeen).toLocaleString('fr-FR') : '-'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default RemotesTab;
