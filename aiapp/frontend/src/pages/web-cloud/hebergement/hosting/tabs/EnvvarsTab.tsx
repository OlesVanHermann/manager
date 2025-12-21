// ============================================================
// HOSTING TAB: ENVVARS - Variables d'environnement avec CRUD
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, EnvVar } from "../../../../../services/web-cloud.hosting";
import { CreateEnvvarModal } from "../components/CreateEnvvarModal";

interface Props { serviceName: string; }

/** Onglet Variables d'environnement avec création et suppression. */
export function EnvvarsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadEnvVars = useCallback(async () => {
    try {
      setLoading(true);
      const keys = await hostingService.listEnvVars(serviceName);
      const data = await Promise.all(keys.map(k => hostingService.getEnvVar(serviceName, k)));
      setEnvVars(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadEnvVars();
  }, [loadEnvVars]);

  const handleDelete = async (key: string) => {
    if (!confirm(t("envvars.confirmDelete", { key }))) return;
    try {
      await hostingService.deleteEnvVar(serviceName, key);
      loadEnvVars();
    } catch (err) {
      alert(String(err));
    }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="envvars-tab">
      <div className="tab-header">
        <div>
          <h3>{t("envvars.title")}</h3>
          <p className="tab-description">{t("envvars.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{envVars.length} {t("envvars.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("envvars.create")}
          </button>
        </div>
      </div>

      {envVars.length === 0 ? (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" /></svg>
          <p>{t("envvars.empty")}</p>
          <span className="empty-hint">{t("envvars.emptyHint")}</span>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} style={{ marginTop: 'var(--space-3)' }}>
            {t("envvars.createFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("envvars.key")}</th>
              <th>{t("envvars.value")}</th>
              <th>{t("envvars.type")}</th>
              <th>{t("envvars.status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {envVars.map(v => (
              <tr key={v.key}>
                <td className="font-mono">{v.key}</td>
                <td className="font-mono">{v.type === 'password' ? '••••••••' : v.value}</td>
                <td><span className={`badge ${v.type === 'password' ? 'warning' : 'info'}`}>{v.type}</span></td>
                <td><span className={`badge ${v.status === 'active' ? 'success' : 'error'}`}>{v.status}</span></td>
                <td>
                  <button
                    className="btn-icon btn-danger-icon"
                    onClick={() => handleDelete(v.key)}
                    title={t("envvars.delete")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateEnvvarModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadEnvVars}
      />
    </div>
  );
}

export default EnvvarsTab;
