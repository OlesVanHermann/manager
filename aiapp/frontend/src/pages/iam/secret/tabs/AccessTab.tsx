// ============================================================
// ACCESS TAB - Gestion des accès au Secret Manager
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as secretService from "../../../../services/iam.secret";

// ============================================================
// TYPES
// ============================================================

interface AccessRule {
  id: string;
  identity: string;
  identityType: "user" | "service_account" | "group";
  permission: "read" | "write" | "admin";
  createdAt: string;
}

interface AccessTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des règles d'accès au Secret Manager. */
export default function AccessTab({ serviceId }: AccessTabProps) {
  const { t } = useTranslation("iam/secret/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [rules, setRules] = useState<AccessRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadRules();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await secretService.getAccessRules(serviceId);
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleRevoke = async (ruleId: string) => {
    if (!confirm(t("access.confirmRevoke"))) return;
    try {
      await secretService.revokeAccess(serviceId, ruleId);
      loadRules();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ---------- HELPERS ----------
  const getIdentityIcon = (type: AccessRule["identityType"]) => {
    const icons: Record<string, string> = {
      user: "👤",
      service_account: "🤖",
      group: "👥",
    };
    return icons[type] || "❓";
  };

  const getPermissionBadge = (permission: AccessRule["permission"]) => {
    const classes: Record<string, string> = {
      read: "badge-info",
      write: "badge-warning",
      admin: "badge-error",
    };
    return <span className={`status-badge ${classes[permission]}`}>{t(`access.permissions.${permission}`)}</span>;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadRules}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="access-tab">
      <div className="tab-toolbar">
        <button className="btn btn-primary">{t("access.grant")}</button>
      </div>

      {rules.length === 0 ? (
        <div className="empty-state">
          <h2>{t("access.empty.title")}</h2>
          <p>{t("access.empty.description")}</p>
        </div>
      ) : (
        <table className="secrets-table">
          <thead>
            <tr>
              <th>{t("access.columns.identity")}</th>
              <th>{t("access.columns.type")}</th>
              <th>{t("access.columns.permission")}</th>
              <th>{t("access.columns.granted")}</th>
              <th>{t("access.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>
                  <span className="identity-icon">{getIdentityIcon(rule.identityType)}</span>
                  {rule.identity}
                </td>
                <td>{t(`access.types.${rule.identityType}`)}</td>
                <td>{getPermissionBadge(rule.permission)}</td>
                <td>{new Date(rule.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="secret-actions">
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleRevoke(rule.id)}>{t("access.revoke")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
