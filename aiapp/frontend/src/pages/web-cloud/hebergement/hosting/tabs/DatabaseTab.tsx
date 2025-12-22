// ============================================================
// HOSTING TAB: DATABASE - Bases de données
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Database } from "../../../../../services/web-cloud.hosting";
import { CreateDatabaseModal } from "../components/CreateDatabaseModal";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

interface DatabaseSlot {
  type: 'used' | 'available';
  database?: Database;
}

/** Onglet Bases de données avec slots et progress bars. */
export function DatabaseTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [maxDatabases] = useState(5); // TODO: get from hosting details

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

  // Build slots (used + available)
  const slots: DatabaseSlot[] = useMemo(() => {
    const usedSlots: DatabaseSlot[] = databases.map(db => ({ type: 'used', database: db }));
    const availableCount = Math.max(0, maxDatabases - databases.length);
    const availableSlots: DatabaseSlot[] = Array(availableCount).fill(null).map(() => ({ type: 'available' }));
    return [...usedSlots, ...availableSlots];
  }, [databases, maxDatabases]);

  // Filtering (only used databases)
  const filteredSlots = useMemo(() => {
    if (!searchTerm) return slots;
    const term = searchTerm.toLowerCase();
    return slots.filter(s => 
      s.type === 'available' || 
      s.database?.user?.toLowerCase().includes(term) ||
      s.database?.name?.toLowerCase().includes(term)
    );
  }, [slots, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSlots.length / PAGE_SIZE);
  const paginatedSlots = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSlots.slice(start, start + PAGE_SIZE);
  }, [filteredSlots, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  };

  const getQuotaPercent = (db: Database) => {
    if (!db.quotaUsed || !db.quotaSize) return 0;
    return Math.round((db.quotaUsed / db.quotaSize) * 100);
  };

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
          <span className="records-count">
            {databases.length}/{maxDatabases} {t("database.count")}
          </span>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={() => setShowCreateModal(true)}
            disabled={databases.length >= maxDatabases}
          >
            + {t("database.create")}
          </button>
        </div>
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
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>{t("database.user")}</th>
            <th>{t("database.name")}</th>
            <th>{t("database.server")}</th>
            <th>{t("database.size")}</th>
            <th>{t("database.version")}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSlots.map((slot, idx) => (
            slot.type === 'used' && slot.database ? (
              <tr key={slot.database.name}>
                <td className="font-mono">{slot.database.user}</td>
                <td className="font-mono">{slot.database.name}</td>
                <td className="font-mono">{slot.database.server || '-'}</td>
                <td>
                  <div className="quota-cell">
                    <div className="quota-bar-small">
                      <div 
                        className="quota-fill" 
                        style={{ width: `${getQuotaPercent(slot.database)}%` }}
                      />
                    </div>
                    <span className="quota-text-small">
                      {formatSize(slot.database.quotaUsed)} / {formatSize(slot.database.quotaSize)}
                    </span>
                  </div>
                </td>
                <td>{slot.database.version || '-'}</td>
                <td>
                  <button 
                    className="btn-icon btn-danger-icon" 
                    onClick={() => handleDelete(slot.database!.name)}
                    title={t("database.delete")}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={`available-${idx}`} className="row-available">
                <td colSpan={5} className="text-muted">
                  {t("database.available")} — {t("database.toCreate")}
                </td>
                <td>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowCreateModal(true)}
                  >
                    + {t("database.create")}
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="pagination-info">
            {t("common.page")} {currentPage} / {totalPages}
          </span>
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
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
