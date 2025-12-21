// ============================================================
// HOSTING TAB: DATABASE - Bases de donnees avec CRUD
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Database } from "../../../../../services/web-cloud.hosting";
import { CreateDatabaseModal } from "../components/CreateDatabaseModal";

interface Props { serviceName: string; }

/** Onglet Bases de donnees avec création et suppression. */
export function DatabaseTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listDatabases(serviceName);
      const data = await Promise.all(names.map(n => hostingService.getDatabase(serviceName, n)));
      setDatabases(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadDatabases();
  }, [loadDatabases]);

  const handleDelete = async (name: string) => {
    if (!confirm(t("database.confirmDelete", { name }))) return;
    try {
      await hostingService.deleteDatabase(serviceName, name);
      loadDatabases();
    } catch (err) {
      alert(String(err));
    }
  };

  const formatQuota = (q: { value: number; unit: string }) => q.unit === 'MB' ? `${q.value} MB` : `${q.value} ${q.unit}`;
  const getQuotaPercent = (used: { value: number }, size: { value: number }) => Math.round((used.value / size.value) * 100);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="database-tab">
      <div className="tab-header">
        <div>
          <h3>{t("database.title")}</h3>
          <p className="tab-description">{t("database.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{databases.length} {t("database.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("database.create")}
          </button>
        </div>
      </div>

      {databases.length === 0 ? (
        <div className="empty-state">
          <p>{t("database.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("database.createFirst")}
          </button>
        </div>
      ) : (
        <div className="database-cards">
          {databases.map(db => (
            <div key={db.name} className="database-card">
              <div className="db-header">
                <span className={`db-type type-${db.type}`}>{db.type}</span>
                <div className="db-actions">
                  <span className={`badge ${db.state === 'activated' ? 'success' : 'warning'}`}>{db.state}</span>
                  <button className="btn-icon btn-danger-icon" onClick={() => handleDelete(db.name)} title={t("database.delete")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
              <h4 className="font-mono">{db.name}</h4>
              <div className="db-info">
                <div><label>{t("database.server")}</label><span className="font-mono">{db.server}:{db.port}</span></div>
                <div><label>{t("database.user")}</label><span className="font-mono">{db.user}</span></div>
                <div><label>{t("database.version")}</label><span>{db.version}</span></div>
              </div>
              <div className="quota-mini">
                <div className="quota-bar"><div className="quota-fill" style={{ width: `${getQuotaPercent(db.quotaUsed, db.quotaSize)}%` }} /></div>
                <span>{formatQuota(db.quotaUsed)} / {formatQuota(db.quotaSize)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateDatabaseModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadDatabases}
      />
    </div>
  );
}

export default DatabaseTab;
