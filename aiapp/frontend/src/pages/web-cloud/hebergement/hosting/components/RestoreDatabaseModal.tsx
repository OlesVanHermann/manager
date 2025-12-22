// ============================================================
// MODAL: Restore Database (Restauration)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, DatabaseDump } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  databaseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour restaurer une base de données depuis un dump. */
export function RestoreDatabaseModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [dumps, setDumps] = useState<DatabaseDump[]>([]);
  const [selectedDump, setSelectedDump] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDumps, setLoadingDumps] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- LOAD DUMPS ----------
  useEffect(() => {
    if (!isOpen) return;
    const loadDumps = async () => {
      setLoadingDumps(true);
      try {
        const dumpIds = await hostingService.listDatabaseDumps(serviceName, databaseName);
        const dumpDetails = await Promise.all(
          dumpIds.map(id => hostingService.getDatabaseDump(serviceName, databaseName, id))
        );
        setDumps(dumpDetails.sort((a, b) => 
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        ));
      } catch (err) {
        setError(String(err));
      } finally {
        setLoadingDumps(false);
      }
    };
    loadDumps();
  }, [isOpen, serviceName, databaseName]);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (selectedDump === null) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.restoreDatabaseDump(serviceName, databaseName, selectedDump);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " o";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
    return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
  };

  if (!isOpen) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("database.restore")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <p className="modal-info">
            Restaurer la base <strong>{databaseName}</strong> depuis une sauvegarde
          </p>

          <div className="warning-box">
            <strong>Attention :</strong> La restauration écrasera toutes les données actuelles de la base.
          </div>

          {loadingDumps ? (
            <div className="loading-state">Chargement des sauvegardes...</div>
          ) : dumps.length === 0 ? (
            <div className="empty-state">
              <p>Aucune sauvegarde disponible pour cette base.</p>
            </div>
          ) : (
            <div className="dumps-list">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th>Date</th>
                    <th>Taille</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {dumps.map(dump => (
                    <tr 
                      key={dump.id} 
                      className={selectedDump === dump.id ? "selected" : ""}
                      onClick={() => setSelectedDump(dump.id)}
                    >
                      <td>
                        <input
                          type="radio"
                          name="dumpSelection"
                          checked={selectedDump === dump.id}
                          onChange={() => setSelectedDump(dump.id)}
                        />
                      </td>
                      <td>{formatDate(dump.creationDate)}</td>
                      <td>{formatSize(dump.size || 0)}</td>
                      <td>{dump.type || "manual"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button 
            className="btn btn-warning" 
            onClick={handleSubmit} 
            disabled={selectedDump === null || loading}
          >
            {loading ? "Restauration..." : "Restaurer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestoreDatabaseModal;
