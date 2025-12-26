// ============================================================
// COMMUNICATIONS TAB - Emails et notifications reçus
// NAV1: general / NAV2: support / NAV3: communications
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .support-communications-
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
      high: { label: t("communications.priorities.high"), className: "support-communications-badge-error" },
      medium: { label: t("communications.priorities.medium"), className: "support-communications-badge-warning" },
      low: { label: t("communications.priorities.low"), className: "support-communications-badge-info" },
      normal: { label: t("communications.priorities.normal"), className: "support-communications-badge-neutral" },
    };
    return map[priority?.toLowerCase()] || { label: priority || t("communications.priorities.normal"), className: "support-communications-badge-neutral" };
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
      VALID: { label: t("communications.contactStatus.valid"), className: "support-communications-badge-success" },
      TO_VALIDATE: { label: t("communications.contactStatus.toValidate"), className: "support-communications-badge-warning" },
      ERROR: { label: t("communications.contactStatus.error"), className: "support-communications-badge-error" },
      DISABLED: { label: t("communications.contactStatus.disabled"), className: "support-communications-badge-neutral" },
    };
    return map[status] || { label: status, className: "support-communications-badge-neutral" };
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="support-communications-container">
        <div className="support-communications-loading-state">
          <div className="support-communications-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="support-communications-container">
        <div className="support-communications-error-banner">
          {error}
          <button onClick={loadData} className="support-communications-btn communications-btn-secondary communications-btn-sm">
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="support-communications-container">
      <div className="support-communications-header">
        <h2>{t("communications.title")}</h2>
        <p>{t("communications.subtitle")}</p>
      </div>

      {contactMeans.length > 0 && (
        <div className="support-communications-contacts-section">
          <h3 className="support-communications-section-title">{t("communications.configuredContacts")}</h3>
          <div className="support-communications-contacts-chips">
            {contactMeans.map((c) => {
              const status = getContactStatusBadge(c.status);
              return (
                <div key={c.id} className="support-communications-contact-chip">
                  <MailIcon />
                  <span>{c.email}</span>
                  <span className={`communications-badge ${status.className}`}>{status.label}</span>
                  {c.default && <span className="support-communications-badge communications-badge-info">{t("communications.default")}</span>}
                </div>
              );
            })}
          </div>
          <a href={SUPPORT_URLS.managerContacts} target="_blank" rel="noopener noreferrer" className="support-communications-manage-link">
            {t("communications.manageContacts")} →
          </a>
        </div>
      )}

      <h3 className="support-communications-section-title">
        {t("communications.history")} ({notifications.length})
      </h3>

      {notifications.length === 0 ? (
        <div className="support-communications-empty-state">
          <MailIcon />
          <h3>{t("communications.empty.title")}</h3>
          <p>{t("communications.empty.description")}</p>
        </div>
      ) : (
        <div className="support-communications-list">
          {notifications.map((n) => {
            const priority = getPriorityBadge(n.priority);
            return (
              <div key={n.id} className="support-communications-item">
                <div className="support-communications-icon">
                  <MailIcon />
                </div>
                <div className="support-communications-content">
                  <h4>{n.subject}</h4>
                  <div className="support-communications-item-meta">
                    <span className="support-communications-date">{formatDate(n.createdAt)}</span>
                    <span className="support-communications-badge communications-badge-neutral">{getCategoryLabel(n.category)}</span>
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
