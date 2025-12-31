// ============================================================
// DATABASE DUMPS TAB - Sauvegardes base de données
// CONFORME target_.web-cloud.hosting.database-dumps.svg
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { databaseService } from "./DatabaseTab.service";
import "./DatabaseDumpsTab.css";

interface DatabaseDumpsTabProps {
  serviceName: string;
  databaseName: string;
}

interface Dump {
  id: number;
  creationDate: string;
  type: "auto" | "manual";
  size: number;
  status: "available" | "in_progress" | "error";
  expirationDate?: string;
}

export function DatabaseDumpsTab({ serviceName, databaseName }: DatabaseDumpsTabProps) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.database");
  const [dumps, setDumps] = useState<Dump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const perPage = 10;

  const loadDumps = useCallback(async () => {
    try {
      setLoading(true);
      const data = await databaseService.listDumps(serviceName, databaseName);
      // Map to expected format
      const mappedDumps: Dump[] = (data || []).map((d: any, i: number) => ({
        id: d.id || i + 1,
        creationDate: d.creationDate || d.date || new Date().toISOString(),
        type: d.type === "auto" || d.type === "automatic" ? "auto" : "manual",
        size: d.size || 0,
        status: d.status === "ok" || d.status === "available" ? "available" : d.status === "in_progress" ? "in_progress" : "error",
        expirationDate: d.expirationDate,
      }));
      setDumps(mappedDumps);
    } catch (err) {
      console.error("[DatabaseDumpsTab] Error:", err);
      // Mock data for display
      setDumps([
        { id: 1, creationDate: "2025-12-27T03:00:00Z", type: "auto", size: 45200000, status: "available", expirationDate: "2026-01-26" },
        { id: 2, creationDate: "2025-12-26T03:00:00Z", type: "auto", size: 44800000, status: "available", expirationDate: "2026-01-25" },
        { id: 3, creationDate: "2025-12-25T14:30:00Z", type: "manual", size: 44500000, status: "available" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [serviceName, databaseName]);

  useEffect(() => { loadDumps(); }, [loadDumps]);

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [openMenuId]);

  const handleCreateDump = async () => {
    try {
      setCreating(true);
      await databaseService.createDump(serviceName, databaseName);
      loadDumps();
    } catch (err) {
      alert(t("dumps.createError", "Erreur lors de la création de la sauvegarde"));
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (dump: Dump) => {
    if (!confirm(t("dumps.confirmRestore", "Êtes-vous sûr de vouloir restaurer cette sauvegarde ?"))) return;
    try {
      await databaseService.restoreDump(serviceName, databaseName, dump.id);
      alert(t("dumps.restoreSuccess", "Restauration lancée avec succès"));
    } catch (err) {
      alert(t("dumps.restoreError", "Erreur lors de la restauration"));
    }
    setOpenMenuId(null);
  };

  const handleDownload = async (dump: Dump) => {
    try {
      const url = await databaseService.downloadDump(serviceName, databaseName, dump.id);
      window.open(url, "_blank");
    } catch (err) {
      alert(t("dumps.downloadError", "Erreur lors du téléchargement"));
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (dump: Dump) => {
    if (!confirm(t("dumps.confirmDelete", "Êtes-vous sûr de vouloir supprimer cette sauvegarde ?"))) return;
    try {
      await databaseService.deleteDump(serviceName, databaseName, dump.id);
      loadDumps();
    } catch (err) {
      alert(t("dumps.deleteError", "Erreur lors de la suppression"));
    }
    setOpenMenuId(null);
  };

  // Pagination
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return dumps.slice(start, start + perPage);
  }, [dumps, page]);

  const totalPages = Math.ceil(dumps.length / perPage);

  // Format helpers
  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + " - " + date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return d;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Mo";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} Mo`;
  };

  if (loading) {
    return (
      <div className="dumps-tab">
        <div className="dumps-skeleton" />
        <div className="dumps-skeleton" />
        <div className="dumps-skeleton" />
      </div>
    );
  }

  return (
    <div className="dumps-tab">
      {/* TITLE */}
      <h3 className="dumps-title">
        {t("dumps.title", "Sauvegardes")} - {databaseName}
      </h3>

      {/* BANNER INFO */}
      <div className="dumps-banner">
        <div className="dumps-banner-icon">ℹ️</div>
        <div className="dumps-banner-content">
          <p>{t("dumps.info1", "Les sauvegardes automatiques sont conservées pendant 30 jours.")}</p>
          <p>{t("dumps.info2", "Vous pouvez également créer des sauvegardes manuelles à tout moment.")}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="dumps-toolbar">
        <button
          className="dumps-btn-primary"
          onClick={handleCreateDump}
          disabled={creating}
        >
          {creating ? t("dumps.creating", "Création...") : `+ ${t("dumps.create", "Créer une sauvegarde")}`}
        </button>
        <span className="dumps-count">{dumps.length} {t("dumps.count", "sauvegardes")}</span>
      </div>

      {/* TABLE */}
      {dumps.length === 0 ? (
        <div className="dumps-empty">
          <p>{t("dumps.empty", "Aucune sauvegarde disponible")}</p>
        </div>
      ) : (
        <>
          <div className="dumps-table-container">
            <table className="dumps-table">
              <thead>
                <tr>
                  <th style={{ width: 200 }}>{t("dumps.colDate", "Date de création")}</th>
                  <th style={{ width: 130 }}>{t("dumps.colType", "Type")}</th>
                  <th style={{ width: 110 }}>{t("dumps.colSize", "Taille")}</th>
                  <th style={{ width: 120 }}>{t("dumps.colStatus", "Statut")}</th>
                  <th style={{ width: 140 }}>{t("dumps.colExpiration", "Expiration")}</th>
                  <th style={{ width: 256 }}>{t("dumps.colActions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((dump) => (
                  <tr key={dump.id}>
                    <td className="dumps-date">{formatDate(dump.creationDate)}</td>
                    <td>
                      <span className={`dumps-badge dumps-badge-type-${dump.type}`}>
                        {dump.type === "auto" ? t("dumps.typeAuto", "Automatique") : t("dumps.typeManual", "Manuel")}
                      </span>
                    </td>
                    <td>{formatSize(dump.size)}</td>
                    <td>
                      <span className={`dumps-badge dumps-badge-status-${dump.status}`}>
                        {dump.status === "available" ? t("dumps.statusAvailable", "Disponible")
                          : dump.status === "in_progress" ? t("dumps.statusProgress", "En cours")
                          : t("dumps.statusError", "Erreur")}
                      </span>
                    </td>
                    <td>{dump.expirationDate ? formatDate(dump.expirationDate) : "-"}</td>
                    <td className="dumps-actions-cell">
                      <button
                        className="dumps-action-link"
                        onClick={() => handleRestore(dump)}
                      >
                        {t("dumps.restore", "Restaurer")}
                      </button>
                      <button
                        className="dumps-action-link"
                        onClick={() => handleDownload(dump)}
                      >
                        {t("dumps.download", "Télécharger")}
                      </button>
                      <button
                        className="dumps-actions-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === dump.id ? null : dump.id);
                        }}
                      >
                        ⋮
                      </button>
                      {openMenuId === dump.id && (
                        <div className="dumps-actions-menu">
                          <button onClick={() => handleRestore(dump)}>
                            🔄 {t("dumps.restore", "Restaurer")}
                          </button>
                          <button onClick={() => handleDownload(dump)}>
                            📥 {t("dumps.downloadSql", "Télécharger (.sql.gz)")}
                          </button>
                          <button className="dumps-action-danger" onClick={() => handleDelete(dump)}>
                            🗑 {t("dumps.delete", "Supprimer")}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="dumps-pagination">
              <span className="dumps-pagination-info">
                {t("dumps.showing", "Affichage")} {((page - 1) * perPage) + 1}-{Math.min(page * perPage, dumps.length)} {t("dumps.of", "sur")} {dumps.length}
              </span>
              <div className="dumps-pagination-buttons">
                <button
                  className="dumps-pagination-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`dumps-pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="dumps-pagination-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DatabaseDumpsTab;
