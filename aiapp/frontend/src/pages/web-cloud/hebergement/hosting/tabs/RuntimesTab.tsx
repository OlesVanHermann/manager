// ============================================================
// HOSTING TAB: RUNTIMES - Environnements d'execution avec CRUD
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Runtime } from "../../../../../services/web-cloud.hosting";
import { CreateRuntimeModal } from "../components/CreateRuntimeModal";

interface Props { serviceName: string; }

/** Onglet Environnements d'execution avec création et suppression. */
export function RuntimesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadRuntimes = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listRuntimes(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getRuntime(serviceName, id)));
      setRuntimes(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadRuntimes();
  }, [loadRuntimes]);

  const handleDelete = async (id: number, isDefault: boolean) => {
    if (isDefault) {
      alert(t("runtimes.cannotDeleteDefault"));
      return;
    }
    if (!confirm(t("runtimes.confirmDelete"))) return;
    try {
      await hostingService.deleteRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await hostingService.setDefaultRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="runtimes-tab">
      <div className="tab-header">
        <div>
          <h3>{t("runtimes.title")}</h3>
          <p className="tab-description">{t("runtimes.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{runtimes.length} {t("runtimes.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("runtimes.create")}
          </button>
        </div>
      </div>

      {runtimes.length === 0 ? (
        <div className="empty-state">
          <p>{t("runtimes.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("runtimes.createFirst")}
          </button>
        </div>
      ) : (
        <div className="runtime-cards">
          {runtimes.map(r => (
            <div key={r.id} className={`runtime-card ${r.isDefault ? 'default' : ''}`}>
              {r.isDefault && <span className="default-badge">{t("runtimes.default")}</span>}
              <div className="runtime-type">
                <span className={`badge ${r.type === 'phpfpm' ? 'info' : 'success'}`}>{r.type}</span>
              </div>
              <h4>{r.name}</h4>
              <div className="runtime-info">
                <div><label>{t("runtimes.publicDir")}</label><span className="font-mono">{r.publicDir}</span></div>
                <div><label>{t("runtimes.appEnv")}</label><span>{r.appEnv || '-'}</span></div>
                <div><label>{t("runtimes.bootstrap")}</label><span className="font-mono">{r.appBootstrap || '-'}</span></div>
                <div><label>{t("runtimes.status")}</label><span className={`badge ${r.status === 'active' ? 'success' : 'inactive'}`}>{r.status}</span></div>
              </div>
              <div className="runtime-actions">
                {!r.isDefault && (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSetDefault(r.id)}
                      title={t("runtimes.setDefault")}
                    >
                      {t("runtimes.setDefault")}
                    </button>
                    <button
                      className="btn-icon btn-danger-icon"
                      onClick={() => handleDelete(r.id, !!r.isDefault)}
                      title={t("runtimes.delete")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <h4>{t("runtimes.info")}</h4>
        <p>{t("runtimes.infoDesc")}</p>
      </div>

      <CreateRuntimeModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadRuntimes}
      />
    </div>
  );
}

export default RuntimesTab;
