// ============================================================
// HOSTING TAB: RUNTIMES - Environnements d'exécution
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Runtime } from "../../../../../services/web-cloud.hosting";
import { CreateRuntimeModal } from "../components/CreateRuntimeModal";

interface Props { serviceName: string; }

/** Onglet Runtimes - Environnements d'exécution. */
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

  useEffect(() => { loadRuntimes(); }, [loadRuntimes]);

  const handleDelete = async (id: number, isDefault: boolean) => {
    if (isDefault) { alert(t("runtimes.cannotDeleteDefault")); return; }
    if (!confirm(t("runtimes.confirmDelete"))) return;
    try {
      await hostingService.deleteRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) { alert(String(err)); }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await hostingService.setDefaultRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) { alert(String(err)); }
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

      {/* Info Cloud Web */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <div>
          <strong>{t("runtimes.info")}</strong>
          <p style={{ margin: 'var(--space-1) 0 0 0' }}>{t("runtimes.infoDesc")}</p>
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
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>{t("runtimes.publicDir")}</th>
              <th>{t("runtimes.appEnv")}</th>
              <th>{t("runtimes.default")}</th>
              <th>{t("runtimes.status")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runtimes.map(rt => (
              <tr key={rt.id}>
                <td>{rt.name || `Runtime ${rt.id}`}</td>
                <td className="font-mono">{rt.type}</td>
                <td className="font-mono">{rt.publicDir || '-'}</td>
                <td>{rt.appEnv || 'production'}</td>
                <td>
                  {rt.isDefault ? (
                    <span className="badge success">★ Par défaut</span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleSetDefault(rt.id)}>
                      {t("runtimes.setDefault")}
                    </button>
                  )}
                </td>
                <td>
                  <span className={`badge ${rt.status === 'active' ? 'success' : 'inactive'}`}>
                    {rt.status === 'active' ? 'Actif' : rt.status || 'Actif'}
                  </span>
                </td>
                <td>
                  {!rt.isDefault && (
                    <button 
                      className="btn-icon btn-danger-icon" 
                      onClick={() => handleDelete(rt.id, !!rt.isDefault)} 
                      title={t("runtimes.delete")}
                    >
                      🗑
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
