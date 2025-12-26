// ============================================================
// ACCESS TAB - Gestion des accès au Secret Manager
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as accessService from "./AccessTab.service";
import type { AccessRule } from "../../secret.types";
import "./AccessTab.css";

// ============================================================
// TYPES
// ============================================================

interface AccessTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des règles d'accès au Secret Manager. */
export default function AccessTab({ serviceId }: AccessTabProps) {
  const { t } = useTranslation("iam/secret/access");
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
      const data = await accessService.getAccessRules(serviceId);
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleRevoke = async (ruleId: string) => {
    if (!confirm(t("confirmRevoke"))) return;
    try {
      await accessService.revokeAccess(serviceId, ruleId);
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
    return <div className="secret-access-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="secret-access-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadRules}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="secret-access-tab">
      <div className="secret-access-toolbar">
        <button className="btn btn-primary">{t("grant")}</button>
      </div>

      {rules.length === 0 ? (
        <div className="secret-access-empty-state">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="secret-access-table">
          <thead>
            <tr>
              <th>{t("columns.identity")}</th>
              <th>{t("columns.type")}</th>
              <th>{t("columns.permission")}</th>
              <th>{t("columns.granted")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>
                  <div className="secret-access-identity">
                    <span className="secret-access-identity-icon">{getIdentityIcon(rule.identityType)}</span>
                    <span className="secret-access-identity-name">{rule.identity}</span>
                  </div>
                </td>
                <td>{t(`access.types.${rule.identityType}`)}</td>
                <td>{getPermissionBadge(rule.permission)}</td>
                <td>{new Date(rule.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="secret-access-actions">
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleRevoke(rule.id)}>{t("revoke")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
