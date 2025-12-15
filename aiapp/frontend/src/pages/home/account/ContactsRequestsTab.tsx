// ============================================================
// CONTACTS REQUESTS TAB - Demandes de changement de contacts
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCredentials } from "../../../services/api";
import * as contactsService from "../../../services/contacts.service";

// ============ COMPOSANT ============

/** Affiche les demandes de changement de contacts avec filtrage (pending/all). */
export function ContactsRequestsTab() {
  const { t, i18n } = useTranslation('home/account/contacts-requests');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<contactsService.ContactChange[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");

  // ---------- EFFECTS ----------
  useEffect(() => { loadRequests(); }, []);

  // ---------- LOADERS ----------
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const creds = getCredentials();
      if (!creds) { setError(t('errors.authRequired')); return; }
      const data = await contactsService.getContactChanges(creds);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
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
    return <div className="tab-content"><div className="loading-state"><div className="spinner"></div><p>{t('loading')}</p></div></div>;
  }

  if (error) {
    return <div className="tab-content"><div className="error-banner">{error}<button onClick={loadRequests} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;
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
        <div className="empty-state"><p>{filter === "pending" ? t('empty.pending') : t('empty.all')}</p></div>
      ) : (
        <div className="contacts-table-container">
          <table className="contacts-table">
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
                return (
                  <tr key={req.id}>
                    <td className="service-name">{req.serviceDomain}</td>
                    <td>{getContactTypeName(req.type)}</td>
                    <td><code className="contact-code">{req.from}</code></td>
                    <td><code className="contact-code">{req.to}</code></td>
                    <td>{formatDate(req.askDate)}</td>
                    <td><span className={"status-badge " + status.className}>{status.label}</span></td>
                    <td>{pendingStates.includes(req.state) && <a href={"https://www.ovh.com/manager/#/dedicated/contacts/requests/" + req.id} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{t('actions.manage')}</a>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
