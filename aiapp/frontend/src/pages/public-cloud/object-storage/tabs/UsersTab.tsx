// ============================================================
// PUBLIC-CLOUD / OBJECT-STORAGE / USERS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getS3Users, formatDate } from "./UsersTab.service";
import type { S3User } from "../object-storage.types";
import "./UsersTab.css";

interface UsersTabProps {
  projectId: string;
}

export default function UsersTab({ projectId }: UsersTabProps) {
  const { t } = useTranslation("public-cloud/object-storage/users");
  const { t: tCommon } = useTranslation("common");
  const [users, setUsers] = useState<S3User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [projectId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getS3Users(projectId);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="users-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="users-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadUsers}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="users-tab">
      <div className="users-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      <div className="users-description-card">
        <p className="users-description">{t("description")}</p>
      </div>

      {users.length === 0 ? (
        <div className="users-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>{t("columns.username")}</th>
              <th>{t("columns.description")}</th>
              <th>{t("columns.created")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="users-username">{user.username}</td>
                <td>{user.description || "-"}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td className="users-actions">
                  <button className="btn btn-sm btn-outline">
                    {t("actions.credentials")}
                  </button>
                  <button className="btn btn-sm btn-outline btn-danger">
                    {tCommon("actions.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
