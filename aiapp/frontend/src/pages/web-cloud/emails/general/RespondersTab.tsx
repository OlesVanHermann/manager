// ============================================================
// TAB - Responders (Répondeurs automatiques)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CreateResponderModal } from "../CreateResponderModal";
import { useEmailResponders } from "../useEmailResponders";
import { emailsService } from "../emails.service";
import "./general.css";

interface RespondersTabProps {
  domain?: string;
}

/** Onglet Répondeurs - Gestion des réponses automatiques. */
export default function RespondersTab({ domain }: RespondersTabProps) {
  const { t } = useTranslation("web-cloud/emails/responders");

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Chargement dynamique des répondeurs
  const { responders, loading, error, refresh } = useEmailResponders(domain);

  const filteredResponders = useMemo(() => {
    return responders.filter((r) => {
      if (search && !r.email.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterActive === "active" && !r.active) return false;
      if (filterActive === "inactive" && r.active) return false;
      return true;
    });
  }, [responders, search, filterActive]);

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (responder: typeof responders[0]) => {
    // TODO: Implement edit modal
  };

  const handleToggle = async (responder: typeof responders[0]) => {
    if (!domain) return;
    try {
      await emailsService.toggleResponder(domain, responder.id, !responder.active);
      refresh();
    } catch (err) {
    }
  };

  const handleDelete = async (responder: typeof responders[0]) => {
    if (!domain) return;
    // TODO: Implement delete confirmation modal
    try {
      await emailsService.deleteResponder(domain, responder.id);
      refresh();
    } catch (err) {
    }
  };

  const handleCreateSubmit = async (data: {
    email: string;
    content: string;
    startDate: string;
    endDate: string | null;
    copyTo?: string;
  }) => {
    if (!domain) return;
    await emailsService.createResponder(domain, data);
    refresh();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
    <div className="responders-tab">
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
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterActive === "all" ? "active" : ""}`}
              onClick={() => setFilterActive("all")}
            >
              {t("filters.all")}
            </button>
            <button
              className={`filter-chip ${filterActive === "active" ? "active" : ""}`}
              onClick={() => setFilterActive("active")}
            >
              {t("filters.active")}
            </button>
            <button
              className={`filter-chip ${filterActive === "inactive" ? "active" : ""}`}
              onClick={() => setFilterActive("inactive")}
            >
              {t("filters.inactive")}
            </button>
          </div>
        </div>
      </div>

      {/* Table / Cards */}
      {filteredResponders.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">✉️</div>
          <h3 className="emails-empty-title">{t("empty.title")}</h3>
          <p className="emails-empty-text">{t("empty.description")}</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            + {t("actions.create")}
          </button>
        </div>
      ) : (
        <div className="responders-list">
          {filteredResponders.map((responder) => (
            <div key={responder.id} className={`responder-card ${responder.active ? "active" : "inactive"}`}>
              <div className="responder-header">
                <div className="responder-email">
                  <span className="email-primary">{responder.email}</span>
                  <span className={`status-badge ${responder.active ? "ok" : "suspended"}`}>
                    {responder.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="responder-dates">
                  <span className="date-label">{t("fields.period")}:</span>
                  <span className="date-value">
                    {formatDate(responder.startDate)}
                    {responder.endDate ? ` → ${formatDate(responder.endDate)}` : " → ∞"}
                  </span>
                </div>
              </div>
              <div className="responder-content">
                <p>{responder.content}</p>
              </div>
              <div className="responder-actions">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleToggle(responder)}
                >
                  {responder.active ? t("actions.disable") : t("actions.enable")}
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => handleEdit(responder)}
                >
                  {t("actions.edit")}
                </button>
                <button
                  className="btn btn-sm btn-outline btn-danger"
                  onClick={() => handleDelete(responder)}
                >
                  {t("actions.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateResponderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        existingEmails={responders.map((r) => r.email)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
