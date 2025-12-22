// ============================================================
// MODAL: Copy Database
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, Database } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  databaseName: string;
  databases: Database[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CopyDatabaseModal({ serviceName, databaseName, databases, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [targetDb, setTargetDb] = useState("");
  const [flushTarget, setFlushTarget] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableTargets = databases.filter(db => db.name !== databaseName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDb) {
      setError("Veuillez sélectionner une base de données cible.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await hostingService.copyDatabase(serviceName, databaseName, targetDb, flushTarget);
      onSuccess();
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("database.copyTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-banner">{error}</div>}

            <div className="info-banner">
              <span className="info-icon">ℹ</span>
              <p>Copie le contenu de <strong>{databaseName}</strong> vers une autre base de données.</p>
            </div>

            <div className="form-group">
              <label className="form-label">{t("database.source")}</label>
              <input type="text" className="form-input" value={databaseName} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">{t("database.target")} *</label>
              {availableTargets.length === 0 ? (
                <div className="info-box">
                  <p>Aucune autre base de données disponible pour la copie.</p>
                </div>
              ) : (
                <select 
                  className="form-select" 
                  value={targetDb} 
                  onChange={e => setTargetDb(e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner --</option>
                  {availableTargets.map(db => (
                    <option key={db.name} value={db.name}>{db.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={flushTarget} 
                  onChange={e => setFlushTarget(e.target.checked)} 
                />
                <span>{t("database.flushTarget")}</span>
              </label>
              <span className="form-hint">Vide la base cible avant la copie.</span>
            </div>

            <div className="warning-banner">
              <span className="warning-icon">⚠</span>
              <p>Cette opération peut prendre plusieurs minutes selon la taille de la base.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || availableTargets.length === 0}
            >
              {loading ? t("common.loading") : t("database.copy")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CopyDatabaseModal;
