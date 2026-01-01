// ============================================================
// SUB-TAB - History (Historique des licences)
// ============================================================

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "../OfferBadge";
import { EmailOffer } from "../types";

interface LicenseEvent {
  id: string;
  type: "purchase" | "upgrade" | "downgrade" | "renewal" | "cancellation" | "migration";
  description: string;
  offer?: EmailOffer;
  email?: string;
  packName?: string;
  amount?: number;
  date: string;
  invoiceId?: string;
}

/** Sous-onglet Historique - Historique des opérations sur les licences. */
export default function HistoryTab() {
  const { t } = useTranslation("web-cloud/emails/licenses");

  const [filterType, setFilterType] = useState<string>("all");

  // Mock data - remplacer par appel API
  const events: LicenseEvent[] = useMemo(() => [
    {
      id: "1",
      type: "purchase",
      description: "Achat de licence individuelle",
      offer: "exchange",
      email: "new.user@example.com",
      amount: 6.99,
      date: "2024-01-15T10:30:00Z",
      invoiceId: "FR-2024-001234",
    },
    {
      id: "2",
      type: "upgrade",
      description: "Upgrade du pack Exchange Pro",
      packName: "Pack Exchange Pro",
      offer: "exchange",
      amount: 24.95,
      date: "2024-01-10T14:00:00Z",
      invoiceId: "FR-2024-001200",
    },
    {
      id: "3",
      type: "renewal",
      description: "Renouvellement automatique",
      packName: "Pack Email Pro Startup",
      offer: "email-pro",
      amount: 29.90,
      date: "2024-01-01T00:00:00Z",
      invoiceId: "FR-2024-000100",
    },
    {
      id: "4",
      type: "migration",
      description: "Migration MX Plan → Exchange",
      email: "contact@example.com",
      offer: "exchange",
      date: "2023-12-15T09:00:00Z",
    },
    {
      id: "5",
      type: "cancellation",
      description: "Résiliation de licence",
      email: "old.user@example.com",
      offer: "email-pro",
      date: "2023-12-01T16:00:00Z",
    },
    {
      id: "6",
      type: "purchase",
      description: "Création du Pack Zimbra Team",
      packName: "Pack Zimbra Team",
      offer: "zimbra",
      amount: 19.95,
      date: "2023-11-20T11:00:00Z",
      invoiceId: "FR-2023-009876",
    },
  ], []);

  const filteredEvents = useMemo(() => {
    if (filterType === "all") return events;
    return events.filter((e) => e.type === filterType);
  }, [events, filterType]);

  const handleViewInvoice = (invoiceId: string) => {
    window.open(`/billing/invoices/${invoiceId}`, "_blank");
  };

  const handleExport = () => {
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      purchase: "💳",
      upgrade: "⬆",
      downgrade: "⬇",
      renewal: "↻",
      cancellation: "✗",
      migration: "→",
    };
    return icons[type] || "•";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      purchase: "Achat",
      upgrade: "Upgrade",
      downgrade: "Downgrade",
      renewal: "Renouvellement",
      cancellation: "Résiliation",
      migration: "Migration",
    };
    return labels[type] || type;
  };

  const getTypeClass = (type: string) => {
    const classes: Record<string, string> = {
      purchase: "purchase",
      upgrade: "upgrade",
      renewal: "renewal",
      cancellation: "cancellation",
      migration: "migration",
    };
    return classes[type] || "";
  };

  return (
    <div className="history-tab">
      {/* Toolbar */}
      <div className="emails-toolbar">
        <div className="emails-toolbar-left">
          <div className="filter-chips">
            <button
              className={`filter-chip ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              {t("history.filters.all")}
            </button>
            <button
              className={`filter-chip ${filterType === "purchase" ? "active" : ""}`}
              onClick={() => setFilterType("purchase")}
            >
              💳 {t("history.filters.purchase")}
            </button>
            <button
              className={`filter-chip ${filterType === "renewal" ? "active" : ""}`}
              onClick={() => setFilterType("renewal")}
            >
              ↻ {t("history.filters.renewal")}
            </button>
            <button
              className={`filter-chip ${filterType === "cancellation" ? "active" : ""}`}
              onClick={() => setFilterType("cancellation")}
            >
              ✗ {t("history.filters.cancellation")}
            </button>
          </div>
        </div>
        <div className="emails-toolbar-right">
          <button className="btn btn-outline" onClick={handleExport}>
            ↓ {t("history.actions.export")}
          </button>
        </div>
      </div>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📜</div>
          <h3 className="emails-empty-title">{t("history.empty.title")}</h3>
          <p className="emails-empty-text">{t("history.empty.description")}</p>
        </div>
      ) : (
        <div className="history-timeline">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`timeline-item ${getTypeClass(event.type)}`}>
              <div className="timeline-marker">
                <span className="marker-icon">{getTypeIcon(event.type)}</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className={`event-type ${event.type}`}>
                    {getTypeLabel(event.type)}
                  </span>
                  <span className="event-date">{formatDate(event.date)}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  {event.offer && <OfferBadge offer={event.offer} size="sm" />}
                  {event.email && (
                    <span className="event-email">{event.email}</span>
                  )}
                  {event.packName && (
                    <span className="event-pack">{event.packName}</span>
                  )}
                  {event.amount !== undefined && (
                    <span className="event-amount">
                      {event.type === "cancellation" ? "-" : "+"}{event.amount.toFixed(2)} €
                    </span>
                  )}
                </div>
                {event.invoiceId && (
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => handleViewInvoice(event.invoiceId!)}
                  >
                    📄 {t("history.viewInvoice")} {event.invoiceId}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
