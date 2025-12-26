// ============================================================
// MODAL: Create User - Private Database
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

export function CreatePdbUserModal({ serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !password) return;
    if (password !== confirmPassword) {
      setError(t("users.passwordMismatch"));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiClient.post(`${BASE_PATH}/${serviceName}/user`, { userName, password });
      onSuccess();
      setUserName("");
      setPassword("");
      setConfirmPassword("");
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
          <h3>{t("users.createTitle")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>{t("users.name")}</label>
              <input
                type="text"
                className="form-input"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="my_user"
                pattern="[a-zA-Z0-9_]+"
                required
              />
            </div>
            <div className="form-group">
              <label>{t("users.password")}</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("users.confirmPassword")}</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t("common.cancel")}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("common.creating") : t("users.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePdbUserModal;
