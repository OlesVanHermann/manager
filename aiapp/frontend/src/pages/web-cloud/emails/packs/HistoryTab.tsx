// ============================================================
// SUB-TAB - History (Historique des licences et commandes)
// ============================================================

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { OfferBadge } from "../OfferBadge";
import { orders, services } from "../api";
import type { OrderHistoryItem } from "../api";
import type { EmailOffer } from "../types";

type EventType = "purchase" | "upgrade" | "renewal" | "cancellation" | "migration" | "other";

interface LicenseEvent {
  id: string;
  type: EventType;
  description: string;
  offer?: EmailOffer;
  email?: string;
  packName?: string;
  amount?: number;
  currency?: string;
  date: string;
  invoiceId?: string;
  pdfUrl?: string;
  status?: string;
}

/** Sous-onglet Historique - Historique des opérations sur les licences. */
export default function HistoryTab() {
  const { t } = useTranslation("web-cloud/emails/modals");

  const [events, setEvents] = useState<LicenseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"30" | "90" | "365">("90");

  // Chargement de l'historique des commandes
  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculer les dates de filtrage
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - parseInt(dateRange));

      // Récupérer l'historique des commandes email
      const orderHistory = await orders.getEmailOrderHistory({
        from: fromDate.toISOString().split("T")[0],
        to: toDate.toISOString().split("T")[0],
        limit: 100,
      });

      // Récupérer les services pour mapper les domaines aux offres
      const allServices = await services.getAllEmailServices();
      const serviceMap = new Map<string, EmailOffer>();
      for (const svc of allServices) {
        let offer: EmailOffer = "mx-plan";
        if (svc.type === "exchange") offer = "exchange";
        else if (svc.type === "emailpro") offer = "email-pro";
        else if (svc.type === "zimbra") offer = "zimbra";
        serviceMap.set(svc.domain, offer);
      }

      // Transformer en événements pour l'affichage
      const licenseEvents: LicenseEvent[] = orderHistory
        .filter((order) => {
          // Filtrer uniquement les commandes liées aux emails
          const desc = order.description.toLowerCase();
          return (
            desc.includes("exchange") ||
            desc.includes("email") ||
            desc.includes("mail") ||
            desc.includes("pro")
          );
        })
        .map((order) => {
          // Déterminer l'offre à partir du domaine ou de la description
          let offer: EmailOffer | undefined;
          if (order.domain && serviceMap.has(order.domain)) {
            offer = serviceMap.get(order.domain);
          } else {
            const descLower = order.description.toLowerCase();
            if (descLower.includes("exchange")) offer = "exchange";
            else if (descLower.includes("pro")) offer = "email-pro";
            else if (descLower.includes("zimbra")) offer = "zimbra";
            else if (descLower.includes("mx") || descLower.includes("mail"))
              offer = "mx-plan";
          }

          // Mapper le type de commande
          let eventType: EventType = order.type;
          if (eventType === "other") {
            const descLower = order.description.toLowerCase();
            if (descLower.includes("cancel") || descLower.includes("résili"))
              eventType = "cancellation";
            else if (descLower.includes("migrat")) eventType = "migration";
          }

          return {
            id: String(order.orderId),
            type: eventType,
            description: order.description,
            offer,
            packName: order.domain,
            amount: order.amount,
            currency: order.currency,
            date: order.date,
            invoiceId: String(order.orderId),
            pdfUrl: order.pdfUrl,
            status: order.status,
          };
        });

      setEvents(licenseEvents);
    } catch (err) {
      console.error("Failed to load order history:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredEvents = useMemo(() => {
    if (filterType === "all") return events;
    return events.filter((e) => e.type === filterType);
  }, [events, filterType]);

  const handleViewInvoice = (event: LicenseEvent) => {
    if (event.pdfUrl) {
      window.open(event.pdfUrl, "_blank");
    } else if (event.invoiceId) {
      window.open(`/billing/invoices/${event.invoiceId}`, "_blank");
    }
  };

  const handleExport = () => {
    // Export CSV des événements
    const headers = ["Date", "Type", "Description", "Offre", "Montant", "N° Commande"];
    const rows = filteredEvents.map((e) => [
      formatDate(e.date),
      getTypeLabel(e.type),
      e.description,
      e.offer || "",
      e.amount !== undefined ? `${e.amount.toFixed(2)} ${e.currency || "€"}` : "",
      e.invoiceId || "",
    ]);

    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `email-history-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
      other: "•",
    };
    return icons[type] || "•";
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "purchase":
        return t("history.type.purchase", "Achat");
      case "upgrade":
        return t("history.type.upgrade", "Upgrade");
      case "downgrade":
        return t("history.type.downgrade", "Downgrade");
      case "renewal":
        return t("history.type.renewal", "Renouvellement");
      case "cancellation":
        return t("history.type.cancellation", "Résiliation");
      case "migration":
        return t("history.type.migration", "Migration");
      default:
        return t("history.type.other", "Autre");
    }
  };

  const getTypeClass = (type: string) => {
    const classes: Record<string, string> = {
      purchase: "purchase",
      upgrade: "upgrade",
      renewal: "renewal",
      cancellation: "cancellation",
      migration: "migration",
      other: "",
    };
    return classes[type] || "";
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusClasses: Record<string, string> = {
      paid: "ok",
      notPaid: "pending",
      unpaid: "pending",
      cancelled: "suspended",
      refunded: "info",
      expired: "suspended",
    };
    const statusLabels: Record<string, string> = {
      paid: t("status.paid", "Payé"),
      notPaid: t("status.notPaid", "Non payé"),
      unpaid: t("status.unpaid", "Impayé"),
      cancelled: t("status.cancelled", "Annulé"),
      refunded: t("status.refunded", "Remboursé"),
      expired: t("status.expired", "Expiré"),
    };
    return (
      <span className={`status-badge ${statusClasses[status] || ""}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="history-tab">
        <div className="emails-loading">
          <div className="loading-spinner" />
          <p>{t("loading", "Chargement de l'historique...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-tab">
        <div className="emails-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadHistory}>
            {t("retry", "Réessayer")}
          </button>
        </div>
      </div>
    );
  }

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
              {t("history.filters.all", "Tout")}
            </button>
            <button
              className={`filter-chip ${filterType === "purchase" ? "active" : ""}`}
              onClick={() => setFilterType("purchase")}
            >
              💳 {t("history.filters.purchase", "Achats")}
            </button>
            <button
              className={`filter-chip ${filterType === "renewal" ? "active" : ""}`}
              onClick={() => setFilterType("renewal")}
            >
              ↻ {t("history.filters.renewal", "Renouvellements")}
            </button>
            <button
              className={`filter-chip ${filterType === "cancellation" ? "active" : ""}`}
              onClick={() => setFilterType("cancellation")}
            >
              ✗ {t("history.filters.cancellation", "Résiliations")}
            </button>
          </div>
        </div>
        <div className="emails-toolbar-right">
          <select
            className="filter-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as "30" | "90" | "365")}
          >
            <option value="30">{t("history.range.30days", "30 derniers jours")}</option>
            <option value="90">{t("history.range.90days", "90 derniers jours")}</option>
            <option value="365">{t("history.range.1year", "1 an")}</option>
          </select>
          <button className="btn btn-outline" onClick={loadHistory}>
            ↻ {t("refresh", "Actualiser")}
          </button>
          <button className="btn btn-outline" onClick={handleExport} disabled={events.length === 0}>
            ↓ {t("history.actions.export", "Exporter")}
          </button>
        </div>
      </div>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <div className="emails-empty">
          <div className="emails-empty-icon">📜</div>
          <h3 className="emails-empty-title">
            {t("history.empty.title", "Aucun historique")}
          </h3>
          <p className="emails-empty-text">
            {t(
              "history.empty.description",
              "Aucune opération email trouvée pour cette période."
            )}
          </p>
        </div>
      ) : (
        <>
          <div className="history-timeline">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`timeline-item ${getTypeClass(event.type)}`}
              >
                <div className="timeline-marker">
                  <span className="marker-icon">{getTypeIcon(event.type)}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className={`event-type ${event.type}`}>
                      {getTypeLabel(event.type)}
                    </span>
                    {getStatusBadge(event.status)}
                    <span className="event-date">{formatDate(event.date)}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    {event.offer && <OfferBadge offer={event.offer} size="sm" />}
                    {event.packName && (
                      <span className="event-pack">{event.packName}</span>
                    )}
                    {event.amount !== undefined && event.amount > 0 && (
                      <span
                        className={`event-amount ${event.type === "cancellation" ? "refund" : ""}`}
                      >
                        {event.type === "cancellation" ? "-" : "+"}
                        {event.amount.toFixed(2)} {event.currency || "€"}
                      </span>
                    )}
                  </div>
                  {event.invoiceId && (
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleViewInvoice(event)}
                    >
                      📄 {t("history.viewInvoice", "Voir facture")} #{event.invoiceId}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer count */}
          <div className="table-footer">
            <span className="table-count">
              {filteredEvents.length} {t("history.results", "événement(s)")}
              {filteredEvents.length !== events.length &&
                ` / ${events.length} ${t("history.total", "total")}`}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
