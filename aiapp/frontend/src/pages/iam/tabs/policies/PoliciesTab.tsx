// ============================================================
// POLICIES TAB - Liste des policies IAM (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as policiesService from "./PoliciesTab";
import type { IamPolicy } from "../../iam.types";
import "./PoliciesTab.css";

// ============================================================
// ICONS (défactorisés)
// ============================================================

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="policies-empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

// ============================================================
// COMPOSANT
// ============================================================

/** Affiche la liste des policies IAM avec leurs permissions. */
export default function PoliciesTab() {
  const { t, i18n } = useTranslation("iam/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<IamPolicy[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadPolicies();
  }, []);

  // ---------- LOADERS ----------
  const loadPolicies = async () => {
    const credentials = policiesService.getCredentials();
    if (!credentials) {
      setError(t("errors.notAuthenticated"));
      setLoading(false);
      return;
    }
    try {
      const data = await policiesService.getPolicies(credentials);
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const formatDate = (dateStr: string) => {
    const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
    return policiesService.formatDate(dateStr, locale);
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="policies-tab">
        <div className="policies-loading-state">
          <div className="policies-spinner"></div>
          <p>{t("policies.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policies-tab">
        <div className="policies-error-banner">
          <span>{error}</span>
          <button onClick={loadPolicies} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="policies-tab">
      <div className="policies-section-intro">
        <h2>{t("policies.title")}</h2>
        <p>{t("policies.description")}</p>
      </div>

      <div className="policies-toolbar">
        <span className="policies-result-count">{t("policies.count", { count: policies.length })}</span>
        <button className="btn btn-primary btn-sm">{t("policies.createButton")}</button>
      </div>

      {policies.length === 0 ? (
        <div className="policies-empty-state">
          <ShieldIcon />
          <h3>{t("policies.empty.title")}</h3>
          <p>{t("policies.empty.description")}</p>
          <button className="btn btn-primary">{t("policies.createButton")}</button>
        </div>
      ) : (
        <div className="policies-table-container">
          <table className="policies-table">
            <thead>
              <tr>
                <th>{t("policies.columns.name")}</th>
                <th>{t("policies.columns.description")}</th>
                <th>{t("policies.columns.identities")}</th>
                <th>{t("policies.columns.resources")}</th>
                <th>{t("policies.columns.createdAt")}</th>
                <th>{t("policies.columns.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>
                    <div className="policies-name-cell">
                      <strong>{policy.name}</strong>
                      {policy.readOnly && (
                        <span className="policies-badge policies-badge-neutral">{t("common.readOnly")}</span>
                      )}
                    </div>
                  </td>
                  <td>{policy.description || "-"}</td>
                  <td>{policy.identities?.length || 0}</td>
                  <td>{policy.resources?.length || 0}</td>
                  <td>{formatDate(policy.createdAt)}</td>
                  <td className="policies-actions-cell">
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
