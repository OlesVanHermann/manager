// ============================================================
// GENERAL TAB - Liste des tickets support
// NAV1: general / NAV2: support / NAV3: general
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .general-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as ticketsService from "./GeneralTab.service";
import { getCredentials, formatDate, SUPPORT_URLS } from "./GeneralTab.service";
import { TicketIcon } from "./GeneralTab.icons";
import "./GeneralTab.css";

export function GeneralTab() {
  const { t } = useTranslation("general/support/index");
  const { t: tCommon } = useTranslation("common");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<ticketsService.SupportTicket[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError(t("errors.notAuthenticated"));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await ticketsService.getTickets(credentials, filter);
      setTickets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("errors.loadError");
      if (message.includes("404") || message.includes("not found")) {
        setTickets([]);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStateBadge = (state: string) => {
    const stateMap: Record<string, { label: string; className: string }> = {
      open: { label: t("tickets.states.open"), className: "general-badge-success" },
      closed: { label: t("tickets.states.closed"), className: "general-badge-neutral" },
      unknown: { label: t("tickets.states.unknown"), className: "general-badge-neutral" },
    };
    return stateMap[state] || { label: state, className: "general-badge-neutral" };
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      assistance: { label: t("tickets.types.assistance"), className: "general-badge-info" },
      billing: { label: t("tickets.types.billing"), className: "general-badge-warning" },
      incident: { label: t("tickets.types.incident"), className: "general-badge-error" },
    };
    return typeMap[type] || { label: type, className: "general-badge-neutral" };
  };

  if (loading) {
    return (
      <div className="general-container">
        <div className="general-loading-state">
          <div className="general-spinner"></div>
          <p>{t("tickets.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="general-container">
        <div className="general-error-banner">
          <span>{error}</span>
          <button onClick={loadTickets} className="general-btn general-btn-secondary">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="general-container">
      <div className="general-filter-bar">
        <select
          className="general-filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "open" | "closed")}
        >
          <option value="all">{t("tickets.filters.all")}</option>
          <option value="open">{t("tickets.filters.open")}</option>
          <option value="closed">{t("tickets.filters.closed")}</option>
        </select>
        <span className="general-result-count">
          {t("tickets.count", { count: tickets.length })}
        </span>
      </div>

      {tickets.length === 0 ? (
        <div className="general-empty-state">
          <TicketIcon />
          <h3>{t("tickets.empty.title")}</h3>
          <p>{t("tickets.empty.description")}</p>
        </div>
      ) : (
        <table className="general-table">
          <thead>
            <tr>
              <th>{t("tickets.columns.ticketNumber")}</th>
              <th>{t("tickets.columns.subject")}</th>
              <th>{t("tickets.columns.service")}</th>
              <th>{t("tickets.columns.type")}</th>
              <th>{t("tickets.columns.state")}</th>
              <th>{t("tickets.columns.lastUpdate")}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const state = getStateBadge(ticket.state);
              const type = getTypeBadge(ticket.type);
              return (
                <tr key={ticket.ticketId}>
                  <td>
                    <span className="general-ticket-number">#{ticket.ticketNumber}</span>
                  </td>
                  <td className="general-subject-cell">{ticket.subject}</td>
                  <td>{ticket.serviceName || "-"}</td>
                  <td>
                    <span className={`general-badge ${type.className}`}>{type.label}</span>
                  </td>
                  <td>
                    <span className={`general-badge ${state.className}`}>{state.label}</span>
                  </td>
                  <td>
                    <div className="general-update-info">
                      <span>{formatDate(ticket.updateDate)}</span>
                      <span className="general-last-from">
                        {ticket.lastMessageFrom === "support"
                          ? t("tickets.lastFrom.support")
                          : t("tickets.lastFrom.you")}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="general-table-actions">
        <a
          href={SUPPORT_URLS.helpCenter}
          target="_blank"
          rel="noopener noreferrer"
          className="general-btn general-btn-secondary"
        >
          {t("tickets.helpCenter")}
        </a>
      </div>
    </div>
  );
}
