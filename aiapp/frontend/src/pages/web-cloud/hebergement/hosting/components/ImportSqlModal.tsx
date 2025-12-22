// ============================================================
// MODAL: Import SQL File
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { hostingService } from "../../../../../services/web-cloud.hosting";

interface Props {
  serviceName: string;
  databaseName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour importer un fichier SQL dans une base de données. */
export function ImportSqlModal({ serviceName, databaseName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [documentId, setDocumentId] = useState("");
  const [flushDatabase, setFlushDatabase] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- HANDLERS ----------
  const handleSubmit = async () => {
    if (!documentId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await hostingService.importDatabaseFile(serviceName, databaseName, {
        documentId: documentId.trim(),
        flushDatabase,
        sendEmail
      });
      onSuccess();
      onClose();
      setDocumentId("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDocumentId("");
    setFlushDatabase(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  // ---------- RENDER ----------
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("database.import")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <p className="modal-info">
            Importer un fichier SQL dans la base <strong>{databaseName}</strong>
          </p>

          <div className="info-box">
            <p>
              Pour importer un fichier SQL, vous devez d'abord le déposer sur votre espace FTP 
              dans le dossier <code>/www/</code> ou utiliser l'API documents OVH.
            </p>
          </div>

          <div className="form-group">
            <label>ID du document ou chemin FTP *</label>
            <input
              type="text"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              placeholder="Ex: /www/backup.sql.gz"
            />
            <small className="field-hint">
              Formats supportés : .sql, .sql.gz, .sql.bz2
            </small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={flushDatabase}
                onChange={(e) => setFlushDatabase(e.target.checked)}
              />
              <span>Vider la base avant l'import</span>
            </label>
            {flushDatabase && (
              <div className="warning-inline">
                Toutes les données existantes seront supprimées !
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
              />
              <span>Recevoir un email à la fin de l'import</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={loading}>
            Annuler
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={!documentId.trim() || loading}
          >
            {loading ? "Import..." : "Importer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportSqlModal;
