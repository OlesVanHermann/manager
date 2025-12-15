// ============================================================
// TICKETS TAB - Liste des tickets support
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as supportService from "../../../../services/support.service";
import { getCredentials, formatDate, TicketIcon, SUPPORT_URLS } from "../utils";

// ============ COMPOSANT ============

/** Affiche la liste des tickets support avec filtrage par état (all/open/closed). */
export function TicketsTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<supportService.SupportTicket[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "closed">("all");

  // ---------- EFFECTS ----------
  useEffect(() => { loadTickets(); }, [filter]);

  // ---------- LOADERS ----------
  const loadTickets = async () => {
    const credentials = getCredentials();
    if (!credentials) { setError(t('errors.notAuthenticated')); setLoading(false); return; }

    setLoading(true);
    setError(null);

    try {
      const data = await supportService.getTickets(credentials, filter);
      setTickets(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : t('errors.loadError');
      if (message.includes("404") || message.includes("not found")) {
        setTickets([]);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStateBadge = (state: string) => {
    const stateMap: Record<string, { label: string; className: string }> = {
      open: { label: t('tickets.states.open'), className: "badge-success" },
      closed: { label: t('tickets.states.closed'), className: "badge-neutral" },
      unknown: { label: t('tickets.states.unknown'), className: "badge-neutral" },
    };
    return stateMap[state] || { label: state, className: "badge-neutral" };
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      assistance: { label: t('tickets.types.assistance'), className: "badge-info" },
      billing: { label: t('tickets.types.billing'), className: "badge-warning" },
      incident: { label: t('tickets.types.incident'), className: "badge-error" },
    };
    return typeMap[type] || { label: type, className: "badge-neutral" };
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tickets-tab"><div className="loading-state"><div className="spinner"></div><p>{t('tickets.loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tickets-tab"><div className="error-banner"><span>{error}</span><button onClick={loadTickets}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tickets-tab">
      <div className="filter-bar">
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value as "all" | "open" | "closed")}>
          <option value="all">{t('tickets.filters.all')}</option>
          <option value="open">{t('tickets.filters.open')}</option>
          <option value="closed">{t('tickets.filters.closed')}</option>
        </select>
        <span className="result-count">{t('tickets.count', { count: tickets.length })}</span>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <TicketIcon />
          <h3>{t('tickets.empty.title')}</h3>
          <p>{t('tickets.empty.description')}</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('tickets.columns.ticketNumber')}</th>
              <th>{t('tickets.columns.subject')}</th>
              <th>{t('tickets.columns.service')}</th>
              <th>{t('tickets.columns.type')}</th>
              <th>{t('tickets.columns.state')}</th>
              <th>{t('tickets.columns.lastUpdate')}</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const state = getStateBadge(ticket.state);
              const type = getTypeBadge(ticket.type);
              return (
                <tr key={ticket.ticketId}>
                  <td><span className="ticket-number">#{ticket.ticketNumber}</span></td>
                  <td className="subject-cell">{ticket.subject}</td>
                  <td>{ticket.serviceName || "-"}</td>
                  <td><span className={`badge ${type.className}`}>{type.label}</span></td>
                  <td><span className={`badge ${state.className}`}>{state.label}</span></td>
                  <td>
                    <div className="update-info">
                      <span>{formatDate(ticket.updateDate)}</span>
                      <span className="last-from">{ticket.lastMessageFrom === "support" ? t('tickets.lastFrom.support') : t('tickets.lastFrom.you')}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="table-actions">
        <a href={SUPPORT_URLS.helpCenter} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">{t('tickets.helpCenter')}</a>
      </div>
    </div>
  );
}
