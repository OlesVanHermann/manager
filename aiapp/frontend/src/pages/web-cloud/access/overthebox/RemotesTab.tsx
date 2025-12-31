import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { remotesService } from "./RemotesTab.service";
import type { Remote } from "./overthebox.types";
import "./RemotesTab.css";

interface Props {
  serviceName: string;
}

export function RemotesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/access/overthebox/remotes");
  const [remotes, setRemotes] = useState<Remote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await remotesService.getRemotes(serviceName);
        setRemotes(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  if (loading) {
    return <div className="otb-remotes-loading"><div className="otb-remotes-skeleton" /></div>;
  }

  return (
    <div className="remotes-container">
      <div className="remotes-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="remotes-description">{t("description")}</p>
        </div>
      </div>
      {remotes.length === 0 ? (
        <div className="remotes-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <div className="remotes-cards">
          {remotes.map(r => (
            <div key={r.remoteId} className={`remotes-card ${r.status === 'active' ? 'active' : 'inactive'}`}>
              <div className="remotes-card-header">
                <h4>{r.remoteId}</h4>
                <span className={`otb-remotes-badge ${r.status === 'active' ? 'success' : 'inactive'}`}>
                  {r.status}
                </span>
              </div>
              <div className="remotes-card-info">
                <label>{t("ip")}</label>
                <span>{r.publicIp || '-'}</span>
                <label>{t("port")}</label>
                <span>{r.exposedPort}</span>
                <label>{t("lastSeen")}</label>
                <span>{r.lastSeen ? new Date(r.lastSeen).toLocaleString('fr-FR') : '-'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RemotesTab;
