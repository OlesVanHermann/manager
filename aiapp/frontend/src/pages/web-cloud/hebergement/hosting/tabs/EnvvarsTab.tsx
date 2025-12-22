// ============================================================
// HOSTING TAB: ENVVARS - Variables d'environnement
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, EnvVar } from "../../../../../services/web-cloud.hosting";
import { CreateEnvvarModal } from "../components/CreateEnvvarModal";

interface Props { serviceName: string; }

/** Onglet Variables d'environnement. */
export function EnvvarsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [envvars, setEnvvars] = useState<EnvVar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadEnvvars = useCallback(async () => {
    try {
      setLoading(true);
      const keys = await hostingService.listEnvVars(serviceName);
      const data = await Promise.all(keys.map(k => hostingService.getEnvVar(serviceName, k)));
      setEnvvars(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadEnvvars(); }, [loadEnvvars]);

  const handleDelete = async (key: string) => {
    if (!confirm(t("envvars.confirmDelete", { key }))) return;
    try {
      await hostingService.deleteEnvVar(serviceName, key);
      loadEnvvars();
    } catch (err) { alert(String(err)); }
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
          <span className="records-count">{envvars.length} {t("envvars.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("envvars.create")}
          </button>
        </div>
      </div>

      {/* Info aide */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <span>{t("envvars.emptyHint")}</span>
      </div>

      {envvars.length === 0 ? (
        <div className="empty-state">
          <p>{t("envvars.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
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
            {envvars.map(env => (
              <tr key={env.key}>
                <td className="font-mono">{env.key}</td>
                <td className="font-mono">
                  {env.type === 'password' ? '••••••••' : env.value}
                </td>
                <td>
                  <span className={`badge ${env.type === 'password' ? 'warning' : 'info'}`}>
                    {env.type === 'password' ? 'Masqué' : 'Texte'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${env.status === 'active' ? 'success' : 'inactive'}`}>
                    {env.status === 'active' ? 'Actif' : env.status || 'Actif'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-icon btn-danger-icon" 
                    onClick={() => handleDelete(env.key)} 
                    title={t("envvars.delete")}
                  >
                    🗑
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
        onSuccess={loadEnvvars}
      />
    </div>
  );
}

export default EnvvarsTab;
