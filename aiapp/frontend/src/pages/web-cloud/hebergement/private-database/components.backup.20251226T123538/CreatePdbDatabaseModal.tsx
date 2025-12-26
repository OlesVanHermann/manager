// ============================================================
// MODAL: Create Database - Private Database
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../services/api";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/hosting/privateDatabase";

export function CreatePdbDatabaseModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [databaseName, setDatabaseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!databaseName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`${BASE_PATH}/${serviceName}/database`, { databaseName });
      onSuccess();
      setDatabaseName("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("databases.createTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>{t("databases.name")}</label>
              <input
                type="text"
                className="form-input"
                value={databaseName}
                onChange={e => setDatabaseName(e.target.value)}
                placeholder="my_database"
                pattern="[a-zA-Z0-9_]+"
                required
              />
              <small className="form-hint">{t("databases.nameHint")}</small>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("databases.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePdbDatabaseModal;
