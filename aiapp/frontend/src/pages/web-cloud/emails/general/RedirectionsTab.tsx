// ============================================================
// TAB - Redirections (Règles de redirection email)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CreateRedirectionModal } from "../CreateRedirectionModal";
import { useEmailRedirections } from "../useEmailRedirections";
import { emailsService } from "../emails.service";
import "./general.css";

interface RedirectionsTabProps {
  domain?: string;
}

/** Onglet Redirections - Gestion des règles de redirection. */
export default function RedirectionsTab({ domain }: RedirectionsTabProps) {
  const { t } = useTranslation("web-cloud/emails/redirections");

  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Chargement dynamique des redirections
  const { redirections, loading, error, refresh } = useEmailRedirections(domain);

  const filteredRedirections = useMemo(() => {
    if (!search) return redirections;
    const searchLower = search.toLowerCase();
    return redirections.filter(
      (r) =>
        r.from.toLowerCase().includes(searchLower) ||
        r.to.toLowerCase().includes(searchLower)
    );
  }, [redirections, search]);

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (redirection: typeof redirections[0]) => {
    // TODO: Implement edit modal
  };

  const handleDelete = async (redirection: typeof redirections[0]) => {
    if (!domain) return;
    // TODO: Implement delete confirmation modal
    try {
      await emailsService.deleteRedirection(domain, redirection.id);
      refresh();
    } catch (err) {
    }
  };

  const handleCreateSubmit = async (data: {
    from: string;
    to: string;
    keepCopy: boolean;
  }) => {
    if (!domain) return;
    await emailsService.createRedirection(domain, data);
    refresh();
  };

  // Affichage état de chargement
  if (loading) {
    return (
      <div className="emails-loading">
        <div className="loading-spinner" />
        <p>{t("loading")}</p>
      </div>
    );
  }

  // Affichage erreur
  if (error) {
    return (
      <div className="emails-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={refresh}>
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="redirections-tab">
      {/* Domain indicator */}
      {domain && (
        <div className="domain-indicator">
          <span className="domain-label">{t("currentDomain")}:</span>
          <span className="domain-value">{domain}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("actions.create")}
          </button>
        </div>
        <div className="emails-toolbar-right">
          <input
            type="text"
            className="filter-input"
            placeholder={t("filters.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Info banner */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <p>{t("info.description")}</p>
      </div>

      {/* Table */}
      {filteredRedirections.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">↪️</div>
          <h3 className="emails-empty-title">{t("empty.title")}</h3>
          <p className="emails-empty-text">{t("empty.description")}</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("actions.create")}
          </button>
        </div>
      ) : (
        <table className="emails-table">
          <thead>
            <tr>
              <th>{t("table.from")}</th>
              <th></th>
              <th>{t("table.to")}</th>
              <th>{t("table.type")}</th>
              <th>{t("table.keepCopy")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRedirections.map((redirection) => (
              <tr key={redirection.id}>
                <td>
                  <span className="email-primary">{redirection.from}</span>
                </td>
                <td className="arrow-cell">→</td>
                <td>
                  <span className="email-primary">{redirection.to}</span>
                </td>
                <td>
                  <span className={`type-badge ${redirection.type}`}>
                    {redirection.type === "local" ? "Local" : "Externe"}
                  </span>
                </td>
                <td>
                  {redirection.keepCopy ? (
                    <span className="check-icon">✓</span>
                  ) : (
                    <span className="dash-icon">-</span>
                  )}
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn"
                      title={t("actions.edit")}
                      onClick={() => handleEdit(redirection)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn danger"
                      title={t("actions.delete")}
                      onClick={() => handleDelete(redirection)}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modals */}
      <CreateRedirectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        domain={domain || ""}
        existingEmails={redirections.map((r) => r.from)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
