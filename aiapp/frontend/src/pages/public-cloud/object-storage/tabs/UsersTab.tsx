import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as objectStorageService from "../../../../services/public-cloud.object-storage";

interface S3User { id: string; username: string; description?: string; createdAt: string; }
interface UsersTabProps { projectId: string; }

export default function UsersTab({ projectId }: UsersTabProps) {
  const { t } = useTranslation("public-cloud/object-storage/index");
  const { t: tCommon } = useTranslation("common");
  const [users, setUsers] = useState<S3User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadUsers(); }, [projectId]);

  const loadUsers = async () => {
    try { setLoading(true); setError(null); const data = await objectStorageService.getS3Users(projectId); setUsers(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadUsers}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="users-tab">
      <div className="tab-toolbar"><h2>{t("users.title")}</h2><button className="btn btn-primary">{t("users.create")}</button></div>
      <div className="info-card" style={{ marginBottom: "var(--space-4)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>{t("users.description")}</p>
      </div>
      {users.length === 0 ? (
        <div className="empty-state"><h2>{t("users.empty.title")}</h2><p>{t("users.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("users.columns.username")}</th><th>{t("users.columns.description")}</th><th>{t("users.columns.created")}</th><th>{t("users.columns.actions")}</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}><td className="mono">{user.username}</td><td>{user.description || "-"}</td><td>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("users.actions.credentials")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
