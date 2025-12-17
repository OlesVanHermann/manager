// ============================================================
// ALIASES TAB - Gestion des aliases Elasticsearch
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.dbaas-logs";

// ============================================================
// TYPES
// ============================================================

interface Alias {
  aliasId: string;
  name: string;
  description?: string;
  indexIds: string[];
  streamIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface AliasesTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des aliases Elasticsearch. */
export default function AliasesTab({ serviceId }: AliasesTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadAliases();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadAliases = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getAliases(serviceId);
      setAliases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const handleDelete = async (aliasId: string) => {
    if (!confirm(t("aliases.confirmDelete"))) return;
    try {
      await logsService.deleteAlias(serviceId, aliasId);
      loadAliases();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadAliases}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="aliases-tab">
      <div className="tab-toolbar">
        <h2>{t("aliases.title")}</h2>
        <button className="btn btn-primary">{t("aliases.create")}</button>
      </div>

      {aliases.length === 0 ? (
        <div className="empty-state">
          <h2>{t("aliases.empty.title")}</h2>
          <p>{t("aliases.empty.description")}</p>
        </div>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>{t("aliases.columns.name")}</th>
              <th>{t("aliases.columns.description")}</th>
              <th>{t("aliases.columns.indices")}</th>
              <th>{t("aliases.columns.streams")}</th>
              <th>{t("aliases.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {aliases.map((alias) => (
              <tr key={alias.aliasId}>
                <td>
                  <div className="alias-name">{alias.name}</div>
                </td>
                <td>{alias.description || "-"}</td>
                <td>{alias.indexIds.length}</td>
                <td>{alias.streamIds.length}</td>
                <td className="item-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                  <button className="btn btn-sm btn-outline btn-danger" onClick={() => handleDelete(alias.aliasId)}>{tCommon("actions.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
