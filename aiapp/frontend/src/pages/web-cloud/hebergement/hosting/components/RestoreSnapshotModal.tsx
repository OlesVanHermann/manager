// ============================================================
// MODAL: Restore Snapshot
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Snapshot {
  date: string;
  type: string;
  size?: number;
}

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RestoreSnapshotModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    hostingService.listSnapshots(serviceName)
      .then(setSnapshots)
      .catch(() => setSnapshots([]))
      .finally(() => setLoading(false));
  }, [serviceName, isOpen]);

  if (!isOpen) return null;

  const handleRestore = async () => {
    if (!selectedDate) {
      setError("Veuillez sélectionner un snapshot.");
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir restaurer ce snapshot ? Cette action remplacera les fichiers actuels.")) {
      return;
    }

    setRestoring(true);
    setError(null);

    try {
      await hostingService.restoreSnapshot(serviceName, selectedDate);
      alert("Restauration en cours. Cette opération peut prendre plusieurs minutes.");
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📸 Restaurer un snapshot</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-banner">{error}</div>}

          <div className="warning-banner">
            <span className="warning-icon">⚠</span>
            <div>
              <p><strong>Attention :</strong> La restauration remplacera tous les fichiers actuels par ceux du snapshot sélectionné.</p>
              <p>Les modifications effectuées depuis cette date seront perdues.</p>
            </div>
          </div>

          {loading ? (
            <div className="skeleton-block" style={{ height: "200px" }} />
          ) : snapshots.length === 0 ? (
            <div className="empty-state">
              <p>Aucun snapshot disponible.</p>
              <p className="text-muted">Les snapshots sont créés automatiquement chaque jour.</p>
            </div>
          ) : (
            <div className="snapshots-list">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Taille</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshots.map(snap => (
                    <tr 
                      key={snap.date} 
                      className={selectedDate === snap.date ? "selected" : ""}
                      onClick={() => setSelectedDate(snap.date)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <input 
                          type="radio" 
                          name="snapshot" 
                          checked={selectedDate === snap.date}
                          onChange={() => setSelectedDate(snap.date)}
                        />
                      </td>
                      <td>{formatDate(snap.date)}</td>
                      <td>{snap.type || "Automatique"}</td>
                      <td>{formatSize(snap.size)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button 
            type="button" 
            className="btn btn-warning" 
            onClick={handleRestore}
            disabled={restoring || !selectedDate || snapshots.length === 0}
          >
            {restoring ? "Restauration..." : "Restaurer ce snapshot"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestoreSnapshotModal;
