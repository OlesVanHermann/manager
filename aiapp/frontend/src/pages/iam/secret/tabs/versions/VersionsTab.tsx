// ============================================================
// VERSIONS TAB - Historique des versions de secrets
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as versionsService from "./VersionsTab";
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
  const { t } = useTranslation("iam/secret/index");
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
    return <div className="versions-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="versions-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadVersions}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="versions-empty-state">
        <h2>{t("versions.empty.title")}</h2>
        <p>{t("versions.empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="versions-tab">
      <table className="versions-table">
        <thead>
          <tr>
            <th>{t("versions.columns.secret")}</th>
            <th>{t("versions.columns.version")}</th>
            <th>{t("versions.columns.status")}</th>
            <th>{t("versions.columns.created")}</th>
            <th>{t("versions.columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id}>
              <td className="versions-secret-name">{version.secretName}</td>
              <td className="versions-number">v{version.version}</td>
              <td>{getStatusBadge(version.status)}</td>
              <td>{new Date(version.createdAt).toLocaleDateString("fr-FR")}</td>
              <td className="versions-actions">
                <button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
