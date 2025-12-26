// ============================================================
// VERSIONS TAB - Historique des versions de secrets
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as versionsService from "./VersionsTab.service";
import type { SecretVersion } from "../../secret.types";
import "./VersionsTab.css";

// ============================================================
// TYPES
// ============================================================

interface VersionsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Historique des versions de tous les secrets. */
export default function VersionsTab({ serviceId }: VersionsTabProps) {
  const { t } = useTranslation("iam/secret/versions");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [versions, setVersions] = useState<SecretVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadVersions();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadVersions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await versionsService.getVersions(serviceId);
      setVersions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: SecretVersion["status"]) => {
    const classes: Record<string, string> = {
      enabled: "badge-success",
      disabled: "badge-warning",
      destroyed: "badge-error",
    };
    return <span className={`status-badge ${classes[status]}`}>{t(`versions.status.${status}`)}</span>;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="secret-versions-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="secret-versions-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadVersions}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="secret-versions-empty-state">
        <h2>{t("empty.title")}</h2>
        <p>{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="secret-versions-tab">
      <table className="secret-versions-table">
        <thead>
          <tr>
            <th>{t("columns.secret")}</th>
            <th>{t("columns.version")}</th>
            <th>{t("columns.status")}</th>
            <th>{t("columns.created")}</th>
            <th>{t("columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id}>
              <td className="secret-versions-secret-name">{version.secretName}</td>
              <td className="secret-versions-number">v{version.version}</td>
              <td>{getStatusBadge(version.status)}</td>
              <td>{new Date(version.createdAt).toLocaleDateString("fr-FR")}</td>
              <td className="secret-versions-actions">
                <button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
