// ============================================================
// GROUPS TAB - Liste des groupes de ressources IAM (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as groupsService from "./GroupsTab.service";
import type { IamResourceGroup } from "../../iam.types";
import "./GroupsTab.css";

// ============================================================
// ICONS (défactorisés)
// ============================================================

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="iam-groups-empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche la liste des groupes de ressources IAM. */
export default function GroupsTab() {
  const { t, i18n } = useTranslation("iam/general/groups");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<IamResourceGroup[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadGroups();
  }, []);

  // ---------- LOADERS ----------
  const loadGroups = async () => {
    const credentials = groupsService.getCredentials();
    if (!credentials) {
      setError(t("errors.notAuthenticated"));
      setLoading(false);
      return;
    }
    try {
      const data = await groupsService.getResourceGroups(credentials);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const formatDate = (dateStr: string) => {
    const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
    return groupsService.formatDate(dateStr, locale);
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="iam-groups-tab">
        <div className="iam-groups-loading-state">
          <div className="iam-groups-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="iam-groups-tab">
        <div className="iam-groups-error-banner">
          <span>{error}</span>
          <button onClick={loadGroups} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="iam-groups-tab">
      <div className="iam-groups-section-intro">
        <h2>{t("title")}</h2>
        <p>{t("description")}</p>
      </div>

      <div className="iam-groups-toolbar">
        <span className="iam-groups-result-count">{t("count", { count: groups.length })}</span>
        <button className="btn btn-primary btn-sm">{t("createButton")}</button>
      </div>

      {groups.length === 0 ? (
        <div className="iam-groups-empty-state">
          <FolderIcon />
          <h3>{t("empty.title")}</h3>
          <p>{t("empty.description")}</p>
          <button className="btn btn-primary">{t("createButton")}</button>
        </div>
      ) : (
        <div className="iam-groups-table-container">
          <table className="iam-groups-table">
            <thead>
              <tr>
                <th>{t("columns.name")}</th>
                <th>{t("columns.owner")}</th>
                <th>{t("columns.resources")}</th>
                <th>{t("columns.createdAt")}</th>
                <th>{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>
                    <div className="iam-groups-name-cell">
                      <strong>{group.name}</strong>
                      {group.readOnly && (
                        <span className="iam-groups-badge groups-badge-neutral">{t("common.readOnly")}</span>
                      )}
                    </div>
                  </td>
                  <td>{group.owner}</td>
                  <td>{group.resources?.length || 0}</td>
                  <td>{formatDate(group.createdAt)}</td>
                  <td className="iam-groups-actions-cell">
                    <button className="btn btn-outline btn-sm">{t("actions.edit")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
