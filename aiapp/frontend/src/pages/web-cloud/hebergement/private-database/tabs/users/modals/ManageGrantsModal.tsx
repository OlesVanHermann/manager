// ============================================================
// MODAL: Manage Grants - Private Database
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../../services/api";
import type { PdbUser, PdbDatabase } from "../private-database.types";

interface Props {
  serviceName: string;
  user: PdbUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BASE_PATH = "/hosting/privateDatabase";

type GrantType = "admin" | "rw" | "ro" | "none";

export function ManageGrantsModal({ serviceName, user, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [databases, setDatabases] = useState<PdbDatabase[]>([]);
  const [grants, setGrants] = useState<Record<string, GrantType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDatabases = useCallback(async () => {
    try {
      setLoading(true);
      const names: string[] = await apiClient.get(`${BASE_PATH}/${serviceName}/database`);
      const details = await Promise.all(
        names.map(name => apiClient.get(`${BASE_PATH}/${serviceName}/database/${name}`))
      );
      setDatabases(details);
      
      // Initialiser les grants actuels
      const currentGrants: Record<string, GrantType> = {};
      user.databases?.forEach(db => {
        currentGrants[db.databaseName] = db.grantType as GrantType;
      });
      setGrants(currentGrants);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName, user]);

  useEffect(() => {
    if (isOpen) loadDatabases();
  }, [isOpen, loadDatabases]);

  const handleGrantChange = (databaseName: string, grant: GrantType) => {
    setGrants(prev => ({ ...prev, [databaseName]: grant }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Appliquer chaque grant modifié
      for (const [dbName, grant] of Object.entries(grants)) {
        await apiClient.post(
          `${BASE_PATH}/${serviceName}/user/${user.userName}/grant/${dbName}`, 
          { grant }
        );
      }
      
      onSuccess();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("users.manageGrantsTitle", { user: user.userName })}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          
          {loading ? (
            <div className="loading-spinner">{t("common.loading")}</div>
          ) : databases.length === 0 ? (
            <div className="empty-state">
              <p>{t("databases.empty")}</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("databases.name")}</th>
                  <th>{t("users.grant")}</th>
                </tr>
              </thead>
              <tbody>
                {databases.map(db => (
                  <tr key={db.databaseName}>
                    <td className="font-mono">{db.databaseName}</td>
                    <td>
                      <select
                        className="form-select"
                        value={grants[db.databaseName] || "none"}
                        onChange={e => handleGrantChange(db.databaseName, e.target.value as GrantType)}
                      >
                        <option value="none">Aucun</option>
                        <option value="ro">Lecture seule</option>
                        <option value="rw">Lecture/Écriture</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t("common.cancel")}
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageGrantsModal;
