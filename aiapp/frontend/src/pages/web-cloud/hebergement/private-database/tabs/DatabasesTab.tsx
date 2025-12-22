// ============================================================
// PRIVATE DATABASE TAB: DATABASES - Gestion des bases
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService, PdbDatabase } from "../../../../../services/web-cloud.private-database";
import { CreatePdbDatabaseModal } from "../components/CreatePdbDatabaseModal";

interface Props { serviceName: string; }

/** Onglet Bases de données CloudDB. */
export function DatabasesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [databases, setDatabases] = useState<PdbDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dumpLoading, setDumpLoading] = useState<string | null>(null);

  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      const names = await privateDatabaseService.listDatabases(serviceName);
      const data = await Promise.all(names.map(n => privateDatabaseService.getDatabase(serviceName, n)));
      setDatabases(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadDatabases(); }, [loadDatabases]);

  const handleDelete = async (databaseName: string) => {
    if (!confirm(t("databases.confirmDelete", { name: databaseName }))) return;
    try {
      await privateDatabaseService.deleteDatabase(serviceName, databaseName);
      loadDatabases();
    } catch (err) { alert(String(err)); }
  };

  const handleCreateDump = async (databaseName: string) => {
    try {
      setDumpLoading(databaseName);
      await privateDatabaseService.createDump(serviceName, databaseName);
      alert(t("databases.dumpCreated"));
    } catch (err) { alert(String(err)); }
    finally { setDumpLoading(null); }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="pdb-databases-tab">
      <div className="tab-header">
        <div>
          <h3>{t("databases.title")}</h3>
          <p className="tab-description">{t("databases.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{databases.length} {t("databases.count")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("databases.create")}
          </button>
        </div>
      </div>

      {databases.length === 0 ? (
        <div className="empty-state">
          <p>{t("databases.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("databases.createFirst")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("databases.name")}</th>
              <th>{t("databases.size")}</th>
              <th>{t("databases.users")}</th>
              <th>{t("databases.backupTime")}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {databases.map(db => (
              <tr key={db.databaseName}>
                <td className="font-mono">{db.databaseName}</td>
                <td>{formatSize(db.quotaUsed?.value)}</td>
                <td>
                  {db.users && db.users.length > 0 ? (
                    <div className="users-list">
                      {db.users.slice(0, 3).map(u => (
                        <span key={u} className="badge info">{u}</span>
                      ))}
                      {db.users.length > 3 && (
                        <span className="badge inactive">+{db.users.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>{db.backupTime || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleCreateDump(db.databaseName)}
                      disabled={dumpLoading === db.databaseName}
                    >
                      {dumpLoading === db.databaseName ? "..." : t("databases.dump")}
                    </button>
                    <button 
                      className="btn-icon btn-danger-icon" 
                      onClick={() => handleDelete(db.databaseName)}
                      title={t("databases.delete")}
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

      <CreatePdbDatabaseModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadDatabases}
      />
    </div>
  );
}

export default DatabasesTab;
