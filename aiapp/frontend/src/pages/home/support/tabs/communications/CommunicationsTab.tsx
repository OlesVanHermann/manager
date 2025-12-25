// ============================================================
// COMMUNICATIONS TAB - Emails et notifications reçus
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as communicationsService from "./CommunicationsTab.service";
import { formatDate, SUPPORT_URLS } from "./CommunicationsTab.service";
import { MailIcon } from "./CommunicationsTab.icons";
import "./CommunicationsTab.css";

// ============ COMPOSANT ============

/** Affiche l'historique des notifications/communications reçues et les contacts configurés. */
export function CommunicationsTab() {
  const { t } = useTranslation('home/support/index');
  const { t: tCommon } = useTranslation('common');

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<communicationsService.NotificationHistory[]>([]);
  const [contactMeans, setContactMeans] = useState<communicationsService.ContactMean[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => { loadData(); }, []);

  // ---------- LOADERS ----------
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [notifs, contacts] = await Promise.all([
        communicationsService.getNotificationHistory(50),
        communicationsService.getContactMeans(),
      ]);
      setNotifications(notifs);
      setContactMeans(contacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { label: string; className: string }> = {
      high: { label: t('communications.priorities.high'), className: "badge-error" },
      medium: { label: t('communications.priorities.medium'), className: "badge-warning" },
      low: { label: t('communications.priorities.low'), className: "badge-info" },
      normal: { label: t('communications.priorities.normal'), className: "badge-neutral" },
    };
    return map[priority?.toLowerCase()] || { label: priority || t('communications.priorities.normal'), className: "badge-neutral" };
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      billing: t('communications.categories.billing'),
      incident: t('communications.categories.incident'),
      technical: t('communications.categories.technical'),
      security: t('communications.categories.security'),
      commercial: t('communications.categories.commercial'),
    };
    return map[category?.toLowerCase()] || category || t('communications.categories.other');
  };

  const getContactStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      VALID: { label: t('communications.contactStatus.valid'), className: "badge-success" },
      TO_VALIDATE: { label: t('communications.contactStatus.toValidate'), className: "badge-warning" },
      ERROR: { label: t('communications.contactStatus.error'), className: "badge-error" },
      DISABLED: { label: t('communications.contactStatus.disabled'), className: "badge-neutral" },
    };
    return map[status] || { label: status, className: "badge-neutral" };
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="communications-tab"><div className="communications-loading-state"><div className="communications-spinner"></div><p>{tCommon('loading')}</p></div></div>;
  }

  if (error) {
    return (
      <div className="communications-tab">
        <div className="communications-error-banner">
          {error}
          <button onClick={loadData} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="communications-tab">
      <div className="section-header">
        <h2>{t('communications.title')}</h2>
        <p>{t('communications.subtitle')}</p>
      </div>

      {contactMeans.length > 0 && (
        <div className="contacts-section" style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>{t('communications.configuredContacts')}</h3>
          <div className="contacts-chips" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {contactMeans.map((c) => {
              const status = getContactStatusBadge(c.status);
              return (
                <div key={c.id} className="contact-chip" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "var(--color-background-subtle)", borderRadius: "20px", fontSize: "0.875rem" }}>
                  <MailIcon />
                  <span>{c.email}</span>
                  <span className={`badge ${status.className}`} style={{ fontSize: "0.75rem" }}>{status.label}</span>
                  {c.default && <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>{t('communications.default')}</span>}
                </div>
              );
            })}
          </div>
          <a href={SUPPORT_URLS.managerContacts} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--color-primary)" }}>
            {t('communications.manageContacts')} →
          </a>
        </div>
      )}

      <h3 style={{ fontSize: "1rem", marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
        {t('communications.history')} ({notifications.length})
      </h3>

      {notifications.length === 0 ? (
        <div className="communications-empty-state">
          <MailIcon />
          <h3>{t('communications.empty.title')}</h3>
          <p>{t('communications.empty.description')}</p>
        </div>
      ) : (
        <div className="communications-list">
          {notifications.map((n) => {
            const priority = getPriorityBadge(n.priority);
            return (
              <div key={n.id} className="communications-item">
                <div className="communications-icon">
                  <MailIcon />
                </div>
                <div className="communications-content">
                  <h4>{n.subject}</h4>
                  <div className="communications-meta">
                    <span className="communications-date">{formatDate(n.createdAt)}</span>
                    <span className="badge badge-neutral">{getCategoryLabel(n.category)}</span>
                    <span className={`badge ${priority.className}`}>{priority.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
