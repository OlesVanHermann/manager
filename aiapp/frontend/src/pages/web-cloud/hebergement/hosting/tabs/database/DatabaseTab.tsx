// ============================================================
import "./database.css";
// HOSTING TAB: DATABASE - Bases de données
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Database } from "../../../../../../services/web-cloud.hosting";
import { CreateDatabaseModal, CopyDatabaseModal, DumpDatabaseModal, RestoreDatabaseModal, ImportSqlModal, ChangePasswordModal } from "./modals";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

export function DatabaseTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.database");
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dumpModal, setDumpModal] = useState<{ open: boolean; name: string }>({ open: false, name: "" });
  const [restoreModal, setRestoreModal] = useState<{ open: boolean; name: string }>({ open: false, name: "" });
  const [importModal, setImportModal] = useState<{ open: boolean; name: string }>({ open: false, name: "" });
  const [copyModal, setCopyModal] = useState<{ open: boolean; name: string }>({ open: false, name: "" });
  const [passwordModal, setPasswordModal] = useState<{ open: boolean; name: string }>({ open: false, name: "" });

  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listDatabases(serviceName);
      const data = await Promise.all(names.map(n => hostingService.getDatabase(serviceName, n)));
      setDatabases(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadDatabases(); }, [loadDatabases]);

  const handleDelete = async (name: string) => {
    if (!confirm(t("database.confirmDelete", { name }))) return;
    try {
      await hostingService.deleteDatabase(serviceName, name);
      loadDatabases();
    } catch (err) { alert(String(err)); }
  };

  // --- FILTERING & PAGINATION ---
  const filteredDatabases = useMemo(() => {
    if (!searchTerm) return databases;
    const term = searchTerm.toLowerCase();
    return databases.filter(d => d.name.toLowerCase().includes(term));
  }, [databases, searchTerm]);

  const totalPages = Math.ceil(filteredDatabases.length / PAGE_SIZE);
  const paginatedDatabases = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDatabases.slice(start, start + PAGE_SIZE);
  }, [filteredDatabases, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const formatSize = (quota: { value: number; unit: string } | undefined) => {
    if (!quota) return "-";
    return `${quota.value} ${quota.unit}`;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "400px" }} /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="database-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("database.title")}</h3>
          <p className="tab-description">{t("database.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("database.create")}
          </button>
        </div>
      </div>

      {/* Banner info quota */}
      <div className="info-banner" style={{ marginBottom: "1rem" }}>
        <span className="info-icon">ℹ️</span>
        <span>Le quota affiché est mis à jour toutes les 24h.</span>
        <a href="https://help.ovhcloud.com/csm/fr-web-hosting-database" target="_blank" rel="noopener noreferrer" className="link-action" style={{ marginLeft: "auto" }}>
          En savoir plus →
        </a>
      </div>

      {/* Search */}
      <div className="table-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="records-count">{databases.length} {t("database.count")}</span>
      </div>

      {/* Table */}
      {paginatedDatabases.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult") : t("database.empty")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              {t("database.createFirst")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("database.name")}</th>
                <th>{t("database.user")}</th>
                <th>{t("database.server")}</th>
                <th>{t("database.version")}</th>
                <th>{t("database.size")}</th>
                <th>{t("database.state")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDatabases.map(db => (
                <tr key={db.name}>
                  <td className="font-mono font-medium">{db.name}</td>
                  <td className="font-mono">{db.user || "-"}</td>
                  <td className="font-mono">{db.server || "-"}</td>
                  <td>{db.version || "-"}</td>
                  <td>
                    <div className="size-display">
                      <span>{formatSize(db.quotaUsed)}</span>
                      <span className="size-separator">/</span>
                      <span className="size-total">{formatSize(db.quotaSize)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${db.state === 'ok' ? 'success' : 'warning'}`}>
                      {db.state === 'ok' ? 'Actif' : db.state}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setPasswordModal({ open: true, name: db.name })}
                        title={t("database.changePassword")}
                      >🔑</button>
                      <button 
                        className="btn-icon" 
                        onClick={() => setDumpModal({ open: true, name: db.name })}
                        title={t("database.dump")}
                      >💾</button>
                      <button 
                        className="btn-icon" 
                        onClick={() => setRestoreModal({ open: true, name: db.name })}
                        title={t("database.restore")}
                      >🔄</button>
                      <button 
                        className="btn-icon" 
                        onClick={() => setCopyModal({ open: true, name: db.name })}
                        title={t("database.copy")}
                      >📋</button>
                      <button 
                        className="btn-icon" 
                        onClick={() => setImportModal({ open: true, name: db.name })}
                        title={t("database.import")}
                      >📥</button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(db.name)}
                        title={t("database.delete")}
                      >🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
              <span className="pagination-info">{t("common.page")} {currentPage} / {totalPages}</span>
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateDatabaseModal serviceName={serviceName} isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={loadDatabases} />
      <DumpDatabaseModal serviceName={serviceName} databaseName={dumpModal.name} isOpen={dumpModal.open} onClose={() => setDumpModal({ open: false, name: "" })} onSuccess={loadDatabases} />
      <RestoreDatabaseModal serviceName={serviceName} databaseName={restoreModal.name} isOpen={restoreModal.open} onClose={() => setRestoreModal({ open: false, name: "" })} onSuccess={loadDatabases} />
      <ImportSqlModal serviceName={serviceName} databaseName={importModal.name} isOpen={importModal.open} onClose={() => setImportModal({ open: false, name: "" })} onSuccess={loadDatabases} />
      <CopyDatabaseModal serviceName={serviceName} databaseName={copyModal.name} databases={databases} isOpen={copyModal.open} onClose={() => setCopyModal({ open: false, name: "" })} onSuccess={loadDatabases} />
      <ChangePasswordModal serviceName={serviceName} login={passwordModal.name} type="database" isOpen={passwordModal.open} onClose={() => setPasswordModal({ open: false, name: "" })} onSuccess={loadDatabases} />
    </div>
  );
}

export default DatabaseTab;
