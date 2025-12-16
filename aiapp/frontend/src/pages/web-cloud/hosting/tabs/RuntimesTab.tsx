// ============================================================
// HOSTING TAB: RUNTIMES - Environnements d'execution
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Runtime } from "../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Environnements d'execution. */
export function RuntimesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await hostingService.listRuntimes(serviceName);
        const data = await Promise.all(ids.map(id => hostingService.getRuntime(serviceName, id)));
        setRuntimes(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="runtimes-tab">
      <div className="tab-header">
        <div>
          <h3>{t("runtimes.title")}</h3>
          <p className="tab-description">{t("runtimes.description")}</p>
        </div>
      </div>

      {runtimes.length === 0 ? (
        <div className="empty-state"><p>{t("runtimes.empty")}</p></div>
      ) : (
        <div className="runtime-cards">
          {runtimes.map(r => (
            <div key={r.id} className={`runtime-card ${r.isDefault ? 'default' : ''}`}>
              {r.isDefault && <span className="default-badge">{t("runtimes.default")}</span>}
              <div className="runtime-type"><span className={`badge ${r.type === 'phpfpm' ? 'info' : 'success'}`}>{r.type}</span></div>
              <h4>{r.name}</h4>
              <div className="runtime-info">
                <div><label>{t("runtimes.publicDir")}</label><span className="font-mono">{r.publicDir}</span></div>
                <div><label>{t("runtimes.appEnv")}</label><span>{r.appEnv || '-'}</span></div>
                <div><label>{t("runtimes.bootstrap")}</label><span className="font-mono">{r.appBootstrap || '-'}</span></div>
                <div><label>{t("runtimes.status")}</label><span className={`badge ${r.status === 'active' ? 'success' : 'inactive'}`}>{r.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RuntimesTab;
