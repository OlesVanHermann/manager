// ============================================================
// GROUPS TAB - Liste des groupes de ressources IAM (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as groupsService from "./GroupsTab";
import type { IamResourceGroup } from "../../iam.types";
import "./GroupsTab.css";

// ============================================================
// ICONS (défactorisés)
// ============================================================

function FolderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="groups-empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  );
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche la liste des groupes de ressources IAM. */
export default function GroupsTab() {
  const { t, i18n } = useTranslation("iam/index");
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
      <div className="groups-tab">
        <div className="groups-loading-state">
          <div className="groups-spinner"></div>
          <p>{t("groups.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="groups-tab">
        <div className="groups-error-banner">
          <span>{error}</span>
          <button onClick={loadGroups} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="groups-tab">
      <div className="groups-section-intro">
        <h2>{t("groups.title")}</h2>
        <p>{t("groups.description")}</p>
      </div>

      <div className="groups-toolbar">
        <span className="groups-result-count">{t("groups.count", { count: groups.length })}</span>
        <button className="btn btn-primary btn-sm">{t("groups.createButton")}</button>
      </div>

      {groups.length === 0 ? (
        <div className="groups-empty-state">
          <FolderIcon />
          <h3>{t("groups.empty.title")}</h3>
          <p>{t("groups.empty.description")}</p>
          <button className="btn btn-primary">{t("groups.createButton")}</button>
        </div>
      ) : (
        <div className="groups-table-container">
          <table className="groups-table">
            <thead>
              <tr>
                <th>{t("groups.columns.name")}</th>
                <th>{t("groups.columns.owner")}</th>
                <th>{t("groups.columns.resources")}</th>
                <th>{t("groups.columns.createdAt")}</th>
                <th>{t("groups.columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>
                    <div className="groups-name-cell">
                      <strong>{group.name}</strong>
                      {group.readOnly && (
                        <span className="groups-badge groups-badge-neutral">{t("common.readOnly")}</span>
                      )}
                    </div>
                  </td>
                  <td>{group.owner}</td>
                  <td>{group.resources?.length || 0}</td>
                  <td>{formatDate(group.createdAt)}</td>
                  <td className="groups-actions-cell">
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
