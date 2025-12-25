import "./ContactsRequestsTab.css";
// ============================================================
// CONTACTS REQUESTS TAB - Demandes de changement de contacts
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCredentials } from "../../../../../services/api";
import * as contactsRequestsService from "./ContactsRequestsTab.service";

// ============ TYPES ============

interface ModalState {
  type: "accept" | "refuse" | null;
  request: contactsRequestsService.ContactChange | null;
}

// ============ COMPOSANT ============

/** Affiche les demandes de changement de contacts avec filtrage (pending/all) et actions accept/refuse. */
export function ContactsRequestsTab() {
  const { t, i18n } = useTranslation('home/account/contacts-requests');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<contactsRequestsService.ContactChange[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [modal, setModal] = useState<ModalState>({ type: null, request: null });
  const [token, setToken] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => { loadRequests(); }, []);

  // ---------- LOADERS ----------
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) { setError(t('errors.authRequired')); return; }
      const data = await contactsRequestsService.getContactChanges(creds);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- ACTIONS ----------
  const handleAccept = async () => {
    if (!modal.request || !token.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const creds = getCredentials();
      if (!creds) throw new Error(t('errors.authRequired'));
      await contactsRequestsService.acceptContactChange(creds, modal.request.id, token.trim());
      setModal({ type: null, request: null });
      setToken("");
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.acceptError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefuse = async () => {
    if (!modal.request || !token.trim()) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const creds = getCredentials();
      if (!creds) throw new Error(t('errors.authRequired'));
      await contactsRequestsService.refuseContactChange(creds, modal.request.id, token.trim());
      setModal({ type: null, request: null });
      setToken("");
      await loadRequests();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t('errors.refuseError'));
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (type: "accept" | "refuse", request: contactsRequestsService.ContactChange) => {
    setModal({ type, request });
    setToken("");
    setActionError(null);
  };

  const closeModal = () => {
    if (!actionLoading) {
      setModal({ type: null, request: null });
      setToken("");
      setActionError(null);
    }
  };

  // ---------- HELPERS ----------
  const formatDate = (d: string) => new Date(d).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { day: "numeric", month: "short", year: "numeric" });

  const getStatusBadge = (state: string) => {
    const map: Record<string, { label: string; className: string }> = {
      todo: { label: t('status.todo'), className: "badge-warning" },
      doing: { label: t('status.doing'), className: "badge-info" },
      done: { label: t('status.done'), className: "badge-success" },
      refused: { label: t('status.refused'), className: "badge-error" },
      validatingByCustomers: { label: t('status.validating'), className: "badge-warning" },
    };
    return map[state] || { label: state, className: "badge-neutral" };
  };

  const getContactTypeName = (type: string) => {
    const map: Record<string, string> = {
      contactAdmin: t('contactTypes.admin'),
      contactTech: t('contactTypes.tech'),
      contactBilling: t('contactTypes.billing'),
    };
    return map[type] || type;
  };

  // ---------- COMPUTED ----------
  const pendingStates = ["todo", "doing", "validatingByCustomers"];
  const filteredRequests = filter === "pending" ? requests.filter(r => pendingStates.includes(r.state)) : requests;
  const pendingCount = requests.filter(r => pendingStates.includes(r.state)).length;

  // ---------- RENDER ----------
  if (loading) {
    return <div className="tab-content"><div className="contacts-requests-loading-state"><div className="contacts-requests-spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="contacts-requests-error-banner">{error}<button onClick={loadRequests} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
  }

  return (
    <div className="tab-content">
      <div className="section-header">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </div>

      <div className="filter-bar">
        <button className={"filter-btn" + (filter === "pending" ? " active" : "")} onClick={() => setFilter("pending")}>{t('filters.pending')} ({pendingCount})</button>
        <button className={"filter-btn" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>{t('filters.all')} ({requests.length})</button>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="contacts-requests-empty-state"><p>{filter === "pending" ? t('empty.pending') : t('empty.all')}</p></div>
      ) : (
        <div className="contacts-requests-table-container">
          <table className="contacts-requests-table">
            <thead>
              <tr>
                <th>{t('columns.service')}</th>
                <th>{t('columns.contactType')}</th>
                <th>{t('columns.from')}</th>
                <th>{t('columns.to')}</th>
                <th>{t('columns.date')}</th>
                <th>{t('columns.status')}</th>
                <th>{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                const status = getStatusBadge(req.state);
                const canAct = pendingStates.includes(req.state);
                return (
                  <tr key={req.id}>
                    <td className="service-name">{req.serviceDomain}</td>
                    <td>{getContactTypeName(req.type)}</td>
                    <td><code className="contact-code">{req.from}</code></td>
                    <td><code className="contact-code">{req.to}</code></td>
                    <td>{formatDate(req.askDate)}</td>
                    <td><span className={"status-badge " + status.className}>{status.label}</span></td>
                    <td>
                      {canAct && (
                        <div className="action-buttons">
                          <button onClick={() => openModal("accept", req)} className="btn btn-success btn-sm">{t('actions.accept')}</button>
                          <button onClick={() => openModal("refuse", req)} className="btn btn-outline btn-sm" style={{ marginLeft: "0.5rem" }}>{t('actions.refuse')}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modale Accept/Refuse avec token */}
      {modal.type && modal.request && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.type === "accept" ? t('modal.acceptTitle') : t('modal.refuseTitle')}</h3>
            <p>{t('modal.description')}</p>
            <div className="modal-request-info">
              <p><strong>{t('columns.service')}:</strong> {modal.request.serviceDomain}</p>
              <p><strong>{t('columns.contactType')}:</strong> {getContactTypeName(modal.request.type)}</p>
              <p><strong>{t('columns.from')}:</strong> <code>{modal.request.from}</code> → <strong>{t('columns.to')}:</strong> <code>{modal.request.to}</code></p>
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label htmlFor="token">{t('modal.tokenLabel')}</label>
              <input
                type="text"
                id="token"
                className="input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={t('modal.tokenPlaceholder')}
                disabled={actionLoading}
                autoFocus
              />
              <p className="form-hint">{t('modal.tokenHint')}</p>
            </div>
            {actionError && <div className="contacts-requests-error-banner" style={{ marginTop: "1rem" }}>{actionError}</div>}
            <div className="modal-actions" style={{ marginTop: "1.5rem" }}>
              <button onClick={closeModal} className="btn btn-secondary" disabled={actionLoading}>{tCommon('actions.cancel')}</button>
              <button
                onClick={modal.type === "accept" ? handleAccept : handleRefuse}
                className={modal.type === "accept" ? "btn btn-success" : "btn btn-danger"}
                disabled={actionLoading || !token.trim()}
              >
                {actionLoading ? tCommon('loading') : modal.type === "accept" ? t('actions.accept') : t('actions.refuse')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
