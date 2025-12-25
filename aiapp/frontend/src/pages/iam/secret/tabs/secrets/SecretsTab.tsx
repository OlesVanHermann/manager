// ============================================================
// SECRETS TAB - Liste des secrets
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as secretsService from "./SecretsTab.service";
import type { Secret } from "../../secret.types";
import "./SecretsTab.css";

// ============================================================
// TYPES
// ============================================================

interface SecretsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Liste des secrets avec actions CRUD. */
export default function SecretsTab({ serviceId }: SecretsTabProps) {
  const { t } = useTranslation("iam/secret/secrets");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadSecrets();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadSecrets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await secretsService.getSecrets(serviceId);
      setSecrets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDelete = async (secretId: string) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await secretsService.deleteSecret(serviceId, secretId);
      loadSecrets();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="secrets-loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="secrets-error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadSecrets}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  if (secrets.length === 0) {
    return (
      <div className="secrets-empty-state">
        <h2>{t("empty.title")}</h2>
        <p>{t("empty.description")}</p>
        <button className="btn btn-primary">{t("create")}</button>
      </div>
    );
  }

  return (
    <div className="secrets-tab">
      <div className="secrets-toolbar">
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      <table className="secrets-table">
        <thead>
          <tr>
            <th>{t("columns.name")}</th>
            <th>{t("columns.description")}</th>
            <th>{t("columns.versions")}</th>
            <th>{t("columns.updated")}</th>
            <th>{t("columns.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {secrets.map((secret) => (
            <tr key={secret.id}>
              <td className="secrets-name">{secret.name}</td>
              <td>{secret.description || "-"}</td>
              <td>{secret.versionsCount}</td>
              <td>{new Date(secret.updatedAt).toLocaleDateString("fr-FR")}</td>
              <td className="secrets-actions">
                <button className="btn btn-sm btn-outline">{tCommon("actions.view")}</button>
                <button className="btn btn-sm btn-outline" onClick={() => handleDelete(secret.id)}>{tCommon("actions.delete")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
