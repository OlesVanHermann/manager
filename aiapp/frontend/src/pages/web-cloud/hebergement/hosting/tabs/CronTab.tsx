// ============================================================
// HOSTING TAB: CRON - Tâches planifiées
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Cron } from "../../../../../services/web-cloud.hosting";
import { CreateCronModal } from "../components/CreateCronModal";

interface Props { serviceName: string; }

/** Onglet Tâches planifiées (Cron). */
export function CronTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [crons, setCrons] = useState<Cron[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadCrons = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await hostingService.listCrons(serviceName);
      const data = await Promise.all(ids.map(id => hostingService.getCron(serviceName, id)));
      setCrons(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadCrons(); }, [loadCrons]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("cron.confirmDelete"))) return;
    try {
      await hostingService.deleteCron(serviceName, id);
      loadCrons();
    } catch (err) { alert(String(err)); }
  };

  const handleToggleStatus = async (cron: Cron) => {
    try {
      const newStatus = cron.status === 'enabled' ? 'disabled' : 'enabled';
      await hostingService.updateCron(serviceName, cron.id, { status: newStatus });
      loadCrons();
    } catch (err) { alert(String(err)); }
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="cron-tab">
      <div className="tab-header">
        <div>
          <h3>{t("cron.title")}</h3>
          <p className="tab-description">{t("cron.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{crons.length} {t("cron.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("cron.create")}
          </button>
        </div>
      </div>

      {/* Info aide */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <span>Les tâches planifiées permettent d'exécuter automatiquement des scripts à intervalles réguliers.</span>
        <a href="https://help.ovhcloud.com/csm/fr-web-hosting-cron" target="_blank" rel="noopener noreferrer" className="link-primary">
          Consulter le guide ↗
        </a>
      </div>

      {crons.length === 0 ? (
        <div className="empty-state">
          <p>{t("cron.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("cron.createFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("cron.command")}</th>
              <th>{t("cron.frequency")}</th>
              <th>{t("cron.language")}</th>
              <th>{t("cron.email")}</th>
              <th>{t("cron.status")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {crons.map(cron => (
              <tr key={cron.id}>
                <td className="font-mono" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {cron.command}
                </td>
                <td className="font-mono">{cron.frequency}</td>
                <td>{cron.language}</td>
                <td className="font-mono">{cron.email || '-'}</td>
                <td>
                  <span className={`badge ${cron.status === 'enabled' ? 'success' : 'inactive'}`}>
                    {cron.status === 'enabled' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleToggleStatus(cron)} 
                      title={t("cron.toggleStatus")}
                    >
                      {cron.status === 'enabled' ? '⏸' : '▶'}
                    </button>
                    <button 
                      className="btn-icon btn-danger-icon" 
                      onClick={() => handleDelete(cron.id)} 
                      title={t("cron.delete")}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateCronModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadCrons}
      />
    </div>
  );
}

export default CronTab;
