// ============================================================
// CREATE PDB DATABASE MODAL - Créer une base de données CloudDB
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Modal pour créer une base de données sur CloudDB. */
export function CreatePdbDatabaseModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [databaseName, setDatabaseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateName = (name: string): string | null => {
    if (name.length < 1) return "Le nom est obligatoire";
    if (name.length > 64) return "Maximum 64 caractères";
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
      return "Le nom doit commencer par une lettre et contenir uniquement des lettres, chiffres et underscores";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateName(databaseName);
    if (nameError) {
      setError(nameError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await privateDatabaseService.createDatabase(serviceName, databaseName.trim());
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDatabaseName("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("modals.createDatabase")}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="info-banner" style={{ marginBottom: 'var(--space-4)' }}>
              <span className="info-icon">ℹ</span>
              <p>La base de données sera créée vide. Vous pourrez ensuite y attribuer des utilisateurs.</p>
            </div>

            <div className="form-group">
              <label className="form-label required">Nom de la base de données</label>
              <input
                type="text"
                className="form-input font-mono"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                placeholder="ma_base"
                maxLength={64}
                required
              />
              <span className="form-hint">
                Lettres, chiffres et underscores uniquement. Doit commencer par une lettre.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Création..." : "Créer la base"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePdbDatabaseModal;
