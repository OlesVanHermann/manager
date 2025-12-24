// ============================================================
import "./runtimes.css";
// HOSTING TAB: RUNTIMES - Runtimes PHP
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { runtimesService } from "./RuntimesTab";
import type { Runtime } from "../../hosting.types";
import { CreateRuntimeModal, EditRuntimeModal } from "./modals";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

export function RuntimesTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.runtimes");
  const [runtimes, setRuntimes] = useState<Runtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editRuntime, setEditRuntime] = useState<Runtime | null>(null);

  const loadRuntimes = useCallback(async () => {
    try {
      setLoading(true);
      const ids = await runtimesService.listRuntimes(serviceName);
      const data = await Promise.all(ids.map(id => runtimesService.getRuntime(serviceName, id)));
      setRuntimes(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadRuntimes(); }, [loadRuntimes]);

  const handleDelete = async (id: number, isDefault: boolean) => {
    if (isDefault) {
      alert(t("runtimes.cannotDeleteDefault"));
      return;
    }
    if (!confirm(t("runtimes.confirmDelete", { name: id }))) return;
    try {
      await runtimesService.deleteRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await runtimesService.setDefaultRuntime(serviceName, id);
      loadRuntimes();
    } catch (err) {
      alert(String(err));
    }
  };

  const totalPages = Math.ceil(runtimes.length / PAGE_SIZE);
  const paginatedRuntimes = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return runtimes.slice(start, start + PAGE_SIZE);
  }, [runtimes, currentPage]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "400px" }} /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="runtimes-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("runtimes.title")}</h3>
          <p className="tab-description">{t("runtimes.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            + {t("runtimes.create")}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="info-banner" style={{ marginBottom: "1rem" }}>
        <span className="info-icon">ℹ️</span>
        <span>{t("runtimes.infoDesc")}</span>
      </div>

      {/* Search bar */}
      <div className="table-toolbar">
        <span className="records-count">{runtimes.length} {t("runtimes.count")}</span>
      </div>

      {/* Table */}
      {paginatedRuntimes.length === 0 ? (
        <div className="empty-state">
          <p>{t("runtimes.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            {t("runtimes.createFirst")}
          </button>
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("runtimes.name")}</th>
                <th>{t("runtimes.type")}</th>
                <th>{t("runtimes.phpVersion")}</th>
                <th>{t("runtimes.publicDir")}</th>
                <th>{t("runtimes.status")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRuntimes.map(runtime => (
                <tr key={runtime.id}>
                  <td className="font-medium">
                    {runtime.name || `runtime-${runtime.id}`}
                    {runtime.isDefault && (
                      <span className="badge primary" style={{ marginLeft: "0.5rem" }}>{t("runtimes.default")}</span>
                    )}
                  </td>
                  <td>{runtime.type || "PHP"}</td>
                  <td>
                    <code>{runtime.phpVersion || "-"}</code>
                    {runtime.phpVersion && parseFloat(runtime.phpVersion) < 8.0 && (
                      <span className="badge warning" style={{ marginLeft: "0.5rem" }}>⚠️</span>
                    )}
                  </td>
                  <td><code>{runtime.publicDir || "/public"}</code></td>
                  <td>
                    <span className={`badge ${runtime.status === "ok" ? "success" : "warning"}`}>
                      {runtime.status === "ok" ? "Actif" : runtime.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {!runtime.isDefault && (
                        <button 
                          className="btn-icon" 
                          onClick={() => handleSetDefault(runtime.id)}
                          title={t("runtimes.setDefault")}
                        >⭐</button>
                      )}
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditRuntime(runtime)}
                        title={t("runtimes.edit")}
                      >✏️</button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(runtime.id, runtime.isDefault || false)}
                        title={t("runtimes.delete")}
                        disabled={runtime.isDefault}
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
      <CreateRuntimeModal
        serviceName={serviceName}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadRuntimes}
      />

      {editRuntime && (
        <EditRuntimeModal
          serviceName={serviceName}
          runtime={editRuntime}
          isOpen={!!editRuntime}
          onClose={() => setEditRuntime(null)}
          onSuccess={loadRuntimes}
        />
      )}
    </div>
  );
}

export default RuntimesTab;
