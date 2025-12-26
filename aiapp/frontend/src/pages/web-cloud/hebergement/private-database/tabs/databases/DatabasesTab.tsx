// ============================================================
// PRIVATE DATABASE TAB: Bases de données
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { databasesService } from "./DatabasesTab.service";
import type { PdbDatabase } from "../../private-database.types";
import { CreatePdbDatabaseModal } from "./modals/CreatePdbDatabaseModal";
import { ExtensionsModal } from "./modals/ExtensionsModal";
import "./DatabasesTab.css";

interface Props { 
  serviceName: string; 
  dbType?: string; 
}

/** Onglet Bases de données CloudDB. */
export function DatabasesTab({ serviceName, dbType }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [databases, setDatabases] = useState<PdbDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dumpLoading, setDumpLoading] = useState<string | null>(null);
  const [extensionsTarget, setExtensionsTarget] = useState<string | null>(null);

  const isPostgres = dbType?.toLowerCase() === "postgresql";

  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const names = await databasesService.listDatabases(serviceName);
      const details = await Promise.all(
        names.map(name => databasesService.getDatabase(serviceName, name))
      );
      setDatabases(details);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadDatabases();
  }, [loadDatabases]);

  const handleDelete = async (databaseName: string) => {
    if (!confirm(t("databases.confirmDelete", { name: databaseName }))) return;
    try {
      await databasesService.deleteDatabase(serviceName, databaseName);
      loadDatabases();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleDump = async (databaseName: string) => {
    try {
      setDumpLoading(databaseName);
      await databasesService.createDump(serviceName, databaseName, true);
      alert(t("databases.dumpCreated"));
    } catch (err) {
      alert(String(err));
    } finally {
      setDumpLoading(null);
    }
  };

  const formatSize = (quota: { value: number; unit: string }) => {
    if (quota.unit === "MB") return `${quota.value} Mo`;
    if (quota.unit === "GB") return `${quota.value} Go`;
    return `${quota.value} ${quota.unit}`;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-spinner">{t("common.loading")}</div>;
  }

  if (error) {
    return (
      <div className="privdb-databases-error">
        <p>{error}</p>
        <button className="privdb-databases-btn-primary" onClick={loadDatabases}>
          {t("common.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="databases-tab">
      <div className="databases-header">
        <div>
          <h3>{t("databases.title")}</h3>
          <p className="databases-description">{t("databases.description")}</p>
        </div>
        <button className="privdb-databases-btn-primary" onClick={() => setShowCreateModal(true)}>
          {t("databases.create")}
        </button>
      </div>

      {databases.length === 0 ? (
        <div className="databases-empty">
          <span className="databases-empty-icon">🗄️</span>
          <p>{t("databases.empty")}</p>
          <button className="privdb-databases-btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("databases.createFirst")}
          </button>
        </div>
      ) : (
        <table className="databases-table">
          <thead>
            <tr>
              <th>{t("databases.name")}</th>
              <th>{t("databases.quotaUsed")}</th>
              <th>{t("databases.users")}</th>
              <th>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {databases.map(db => (
              <tr key={db.databaseName}>
                <td>
                  <strong>{db.databaseName}</strong>
                </td>
                <td>
                  {formatSize(db.quotaUsed)} / {formatSize(db.quotaSize)}
                </td>
                <td>{db.usersCount ?? "-"}</td>
                <td>
                  <div className="databases-actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => handleDump(db.databaseName)}
                      disabled={dumpLoading === db.databaseName}
                    >
                      {dumpLoading === db.databaseName ? "..." : t("databases.dump")}
                    </button>
                    {isPostgres && (
                      <button
                        className="btn btn-sm"
                        onClick={() => setExtensionsTarget(db.databaseName)}
                      >
                        {t("databases.extensions")}
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(db.databaseName)}
                    >
                      {t("databases.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="databases-footer">
        <span className="databases-count">
          {databases.length} {t("databases.count")}
        </span>
      </div>

      {/* Modals */}
      <CreatePdbDatabaseModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          loadDatabases();
        }}
      />

      {extensionsTarget && (
        <ExtensionsModal
          serviceName={serviceName}
          databaseName={extensionsTarget}
          isOpen={!!extensionsTarget}
          onClose={() => setExtensionsTarget(null)}
          onSuccess={() => {
            setExtensionsTarget(null);
            loadDatabases();
          }}
        />
      )}
    </div>
  );
}

export default DatabasesTab;
