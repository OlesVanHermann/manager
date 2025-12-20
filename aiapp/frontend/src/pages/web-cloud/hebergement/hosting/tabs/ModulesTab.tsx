// ============================================================
// HOSTING TAB: MODULES - Modules en 1 clic
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Module } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Modules en 1 clic. */
export function ModulesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await hostingService.listModules(serviceName);
        const data = await Promise.all(ids.map(id => hostingService.getModule(serviceName, id)));
        setModules(data);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="modules-tab">
      <div className="tab-header">
        <div>
          <h3>{t("modules.title")}</h3>
          <p className="tab-description">{t("modules.description")}</p>
        </div>
      </div>

      {modules.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
          <p>{t("modules.empty")}</p>
          <span className="empty-hint">{t("modules.emptyHint")}</span>
        </div>
      ) : (
        <div className="module-cards">
          {modules.map(m => (
            <div key={m.id} className="module-card">
              <div className="module-header">
                <span className={`badge ${m.status === 'created' ? 'success' : m.status === 'error' ? 'error' : 'warning'}`}>{m.status}</span>
              </div>
              <h4>{m.adminName}</h4>
              <div className="module-info">
                <div><label>{t("modules.folder")}</label><span className="font-mono">{m.adminFolder}</span></div>
                <div><label>{t("modules.url")}</label><a href={m.targetUrl} target="_blank" rel="noopener noreferrer" className="font-mono">{m.targetUrl}</a></div>
                <div><label>{t("modules.language")}</label><span>{m.language}</span></div>
                <div><label>{t("modules.created")}</label><span>{new Date(m.creationDate).toLocaleDateString()}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModulesTab;
