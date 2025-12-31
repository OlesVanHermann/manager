// ============================================================
// TAB - Lists (Listes de diffusion)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { EmailOffer } from "../types";
import { OfferBadge } from "../components/OfferBadge";
import { CreateListModal } from "../modals";
import { useEmailLists } from "../hooks/useEmailLists";
import { emailsService } from "../emails.service";
import "./tabs.css";

interface ListsTabProps {
  domain?: string;
  offers: EmailOffer[];
}

/** Onglet Listes - Gestion des listes de diffusion et groupes. */
export default function ListsTab({ domain, offers }: ListsTabProps) {
  const { t } = useTranslation("web-cloud/emails/lists");

  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Chargement dynamique des listes
  const { lists, loading, error, refresh } = useEmailLists(domain);

  const filteredLists = useMemo(() => {
    if (!search) return lists;
    const searchLower = search.toLowerCase();
    return lists.filter(
      (l) =>
        l.name.toLowerCase().includes(searchLower) ||
        l.email.toLowerCase().includes(searchLower)
    );
  }, [lists, search]);

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleManageMembers = (list: typeof lists[0]) => {
    // TODO: Open members management panel
    console.log("Manage members", list.id);
  };

  const handleEdit = (list: typeof lists[0]) => {
    // TODO: Implement edit modal
    console.log("Edit list", list.id);
  };

  const handleDelete = async (list: typeof lists[0]) => {
    if (!domain) return;
    // TODO: Implement delete confirmation modal
    try {
      await emailsService.deleteMailingList(domain, list.id);
      refresh();
    } catch (err) {
      console.error("Delete list error:", err);
    }
  };

  const handleCreateSubmit = async (data: {
    name: string;
    localPart: string;
    moderationType: "open" | "moderated" | "closed";
    description?: string;
    welcomeMessage?: string;
  }) => {
    if (!domain) return;
    await emailsService.createMailingList(domain, data);
    refresh();
  };

  const getModerationLabel = (type: string) => {
    const labels: Record<string, string> = {
      open: "Ouvert",
      moderated: "Modéré",
      closed: "Fermé",
    };
    return labels[type] || type;
  };

  const getModerationClass = (type: string) => {
    const classes: Record<string, string> = {
      open: "ok",
      moderated: "pending",
      closed: "suspended",
    };
    return classes[type] || "";
  };

  // Check if offer supports lists
  const supportsLists = offers.some((o) => ["exchange", "email-pro", "zimbra"].includes(o));

  if (!supportsLists) {
    return (
      <div className="emails-empty">
        <div className="emails-empty-icon">📋</div>
        <h3 className="emails-empty-title">{t("notAvailable.title")}</h3>
        <p className="emails-empty-text">{t("notAvailable.description")}</p>
      </div>
    );
  }

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
    <div className="lists-tab">
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

      {/* Table */}
      {filteredLists.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📋</div>
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
              <th>{t("table.list")}</th>
              <th>{t("table.offer")}</th>
              <th>{t("table.members")}</th>
              <th>{t("table.moderation")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredLists.map((list) => (
              <tr key={list.id}>
                <td>
                  <div className="email-cell">
                    <span className="email-primary">{list.name}</span>
                    <span className="email-secondary">{list.email}</span>
                  </div>
                </td>
                <td>
                  <OfferBadge offer={list.offer} />
                </td>
                <td>
                  <span className="members-count">
                    {list.membersCount} {t("table.membersLabel")}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getModerationClass(list.moderationType)}`}>
                    {getModerationLabel(list.moderationType)}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="action-btn"
                      title={t("actions.members")}
                      onClick={() => handleManageMembers(list)}
                    >
                      👥
                    </button>
                    <button
                      className="action-btn"
                      title={t("actions.edit")}
                      onClick={() => handleEdit(list)}
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn danger"
                      title={t("actions.delete")}
                      onClick={() => handleDelete(list)}
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
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        domain={domain || ""}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
