// ============================================================
// COMMUNICATIONS TAB - Emails et notifications reçus
// NAV1: general / NAV2: support / NAV3: communications
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .communications-
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
  const { t } = useTranslation("general/support/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<communicationsService.NotificationHistory[]>([]);
  const [contactMeans, setContactMeans] = useState<communicationsService.ContactMean[]>([]);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadData();
  }, []);

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
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getPriorityBadge = (priority: string) => {
    const map: Record<string, { label: string; className: string }> = {
      high: { label: t("communications.priorities.high"), className: "communications-badge-error" },
      medium: { label: t("communications.priorities.medium"), className: "communications-badge-warning" },
      low: { label: t("communications.priorities.low"), className: "communications-badge-info" },
      normal: { label: t("communications.priorities.normal"), className: "communications-badge-neutral" },
    };
    return map[priority?.toLowerCase()] || { label: priority || t("communications.priorities.normal"), className: "communications-badge-neutral" };
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      billing: t("communications.categories.billing"),
      incident: t("communications.categories.incident"),
      technical: t("communications.categories.technical"),
      security: t("communications.categories.security"),
      commercial: t("communications.categories.commercial"),
    };
    return map[category?.toLowerCase()] || category || t("communications.categories.other");
  };

  const getContactStatusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      VALID: { label: t("communications.contactStatus.valid"), className: "communications-badge-success" },
      TO_VALIDATE: { label: t("communications.contactStatus.toValidate"), className: "communications-badge-warning" },
      ERROR: { label: t("communications.contactStatus.error"), className: "communications-badge-error" },
      DISABLED: { label: t("communications.contactStatus.disabled"), className: "communications-badge-neutral" },
    };
    return map[status] || { label: status, className: "communications-badge-neutral" };
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="communications-container">
        <div className="communications-loading-state">
          <div className="communications-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="communications-container">
        <div className="communications-error-banner">
          {error}
          <button onClick={loadData} className="communications-btn communications-btn-secondary communications-btn-sm">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="communications-container">
      <div className="communications-header">
        <h2>{t("communications.title")}</h2>
        <p>{t("communications.subtitle")}</p>
      </div>

      {contactMeans.length > 0 && (
        <div className="communications-contacts-section">
          <h3 className="communications-section-title">{t("communications.configuredContacts")}</h3>
          <div className="communications-contacts-chips">
            {contactMeans.map((c) => {
              const status = getContactStatusBadge(c.status);
              return (
                <div key={c.id} className="communications-contact-chip">
                  <MailIcon />
                  <span>{c.email}</span>
                  <span className={`communications-badge ${status.className}`}>{status.label}</span>
                  {c.default && <span className="communications-badge communications-badge-info">{t("communications.default")}</span>}
                </div>
              );
            })}
          </div>
          <a href={SUPPORT_URLS.managerContacts} target="_blank" rel="noopener noreferrer" className="communications-manage-link">
            {t("communications.manageContacts")} →
          </a>
        </div>
      )}

      <h3 className="communications-section-title">
        {t("communications.history")} ({notifications.length})
      </h3>

      {notifications.length === 0 ? (
        <div className="communications-empty-state">
          <MailIcon />
          <h3>{t("communications.empty.title")}</h3>
          <p>{t("communications.empty.description")}</p>
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
                  <div className="communications-item-meta">
                    <span className="communications-date">{formatDate(n.createdAt)}</span>
                    <span className="communications-badge communications-badge-neutral">{getCategoryLabel(n.category)}</span>
                    <span className={`communications-badge ${priority.className}`}>{priority.label}</span>
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
