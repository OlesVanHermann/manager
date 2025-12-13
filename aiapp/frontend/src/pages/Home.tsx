// ============================================================
// HOME PAGE - Dashboard accueil OVHcloud (style Hub)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { isAuthenticated, redirectToAuth } from "../services/api";
import * as servicesService from "../services/services.service";
import * as billingService from "../services/billing.service";
import * as notificationsService from "../services/notifications.service";
import { Tile, SkeletonServicesGrid, SkeletonBillCard, SkeletonText } from "../components/Skeleton";
import { ServiceIcon } from "../components/ServiceIcons";
import "./dashboard.css";

// ============ TYPES ============

interface HomeProps {
  onNavigate?: (section: string, options?: { serviceType?: string; tab?: string }) => void;
}

interface LoadingState {
  services: boolean;
  billing: boolean;
  alerts: boolean;
}

interface ErrorState {
  services: string | null;
  billing: string | null;
  alerts: string | null;
}

// ============ HELPERS ============

function getUser(): { firstname?: string; name?: string; nichandle?: string; isTrusted?: boolean } | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

const SERVICE_TYPE_MAP: Record<string, string> = {
  "Noms de domaine": "domain",
  "Hebergements Web": "hosting",
  "Emails": "email",
  "VPS": "vps",
  "Serveurs dedies": "dedicated",
  "Public Cloud": "cloud",
  "IP": "ip",
  "Logs Data Platform": "dbaas",
};

// ============ MAIN COMPONENT ============

export default function Home({ onNavigate }: HomeProps) {
  const user = getUser();

  // States séparés pour chaque section
  const [services, setServices] = useState<servicesService.ServiceSummary | null>(null);
  const [lastBill, setLastBill] = useState<billingService.Bill | null>(null);
  const [debtAmount, setDebtAmount] = useState(0);
  const [alerts, setAlerts] = useState<notificationsService.DashboardAlerts | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    services: true,
    billing: true,
    alerts: true,
  });

  const [errors, setErrors] = useState<ErrorState>({
    services: null,
    billing: null,
    alerts: null,
  });

  // ============ LOADERS ============

  const loadServices = useCallback(async () => {
    setLoading((prev) => ({ ...prev, services: true }));
    setErrors((prev) => ({ ...prev, services: null }));
    try {
      const data = await servicesService.getServicesSummary();
      setServices(data);
    } catch (err) {
      setErrors((prev) => ({ ...prev, services: "Impossible de charger les services" }));
    } finally {
      setLoading((prev) => ({ ...prev, services: false }));
    }
  }, []);

  const loadBilling = useCallback(async () => {
    setLoading((prev) => ({ ...prev, billing: true }));
    setErrors((prev) => ({ ...prev, billing: null }));
    try {
      const [bills, debt] = await Promise.all([
        billingService.getBills({ limit: 1 }),
        billingService.getDebtAccount().catch(() => null),
      ]);
      setLastBill(bills.length > 0 ? bills[0] : null);
      setDebtAmount(debt?.dueAmount?.value || 0);
    } catch (err) {
      setErrors((prev) => ({ ...prev, billing: "Impossible de charger la facturation" }));
    } finally {
      setLoading((prev) => ({ ...prev, billing: false }));
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    setLoading((prev) => ({ ...prev, alerts: true }));
    setErrors((prev) => ({ ...prev, alerts: null }));
    try {
      const data = await notificationsService.getDashboardAlerts();
      setAlerts(data);
    } catch (err) {
      // Alerts are non-critical, don't show error
      setAlerts(null);
    } finally {
      setLoading((prev) => ({ ...prev, alerts: false }));
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }
    loadServices();
    loadBilling();
    loadAlerts();
  }, [loadServices, loadBilling, loadAlerts]);

  // ============ HANDLERS ============

  const handleNavigate = (section: string, options?: { serviceType?: string; tab?: string }) => {
    onNavigate?.(section, options);
  };

  const handleServiceClick = (serviceType: string) => {
    const filterType = SERVICE_TYPE_MAP[serviceType] || serviceType;
    handleNavigate("home-services", { serviceType: filterType });
  };

  // ============ RENDER ============

  return (
    <div className="dashboard-page">
      {/* Bannières système */}
      {alerts?.banners && alerts.banners.length > 0 && (
        <div className="banners-container">
          {alerts.banners.map((banner) => (
            <div key={banner.id} className={`banner-alert banner-${banner.level}`}>
              <span className="banner-message">{banner.message}</span>
              {banner.linkUrl && (
                <a href={banner.linkUrl} className="banner-link" target="_blank" rel="noopener noreferrer">
                  {banner.linkLabel || "En savoir plus"}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Alerte KYC */}
      {alerts?.kycStatus?.required && alerts.kycStatus.status !== "validated" && (
        <div className={`kyc-alert kyc-${alerts.kycStatus.status === "rejected" ? "error" : "warning"}`}>
          <span className="kyc-icon">🪪</span>
          <span className="kyc-message">
            {alerts.kycStatus.status === "pending" 
              ? "Vérification d'identité en cours" 
              : alerts.kycStatus.status === "rejected"
              ? "Vérification d'identité rejetée - action requise"
              : "Vérification d'identité requise"}
          </span>
          <a href="https://www.ovh.com/manager/dedicated/#/identity-documents" className="kyc-link">
            Compléter
          </a>
        </div>
      )}

      {/* Welcome */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Bonjour {user?.firstname || ""},</h1>
          <p className="welcome-subtitle">Bienvenue sur votre espace client OVHcloud</p>
        </div>
        {user?.isTrusted && (
          <span className="badge badge-success trusted-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="badge-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Compte securise
          </span>
        )}
      </div>

      {/* Alerte dette */}
      {!loading.billing && debtAmount > 0 && (
        <div className="debt-alert">
          <span className="debt-icon">⚠️</span>
          <span className="debt-message">
            Vous avez un encours de <strong>{debtAmount.toFixed(2)} €</strong>
          </span>
          <button className="debt-pay-btn" onClick={() => handleNavigate("home-billing", { tab: "debt" })}>
            Regulariser
          </button>
        </div>
      )}

      {/* Layout 2 colonnes */}
      <div className="dashboard-grid">
        {/* Colonne gauche - Services */}
        <div className="dashboard-main">
          {/* Services */}
          <Tile
            title={`Mes services${services ? ` (${services.total})` : ""}`}
            loading={loading.services}
            error={errors.services}
            onRetry={loadServices}
            skeleton={<SkeletonServicesGrid count={6} />}
            className="tile-services"
          >
            {services && services.types.length > 0 ? (
              <div className="services-grid">
                {services.types.map((service) => (
                  <button
                    key={service.type}
                    className="service-card"
                    onClick={() => handleServiceClick(service.type)}
                  >
                    <div className="service-icon-wrapper">
                      <ServiceIcon serviceType={service.type} size={32} className="service-icon" />
                    </div>
                    <div className="service-info">
                      <span className="service-name">{service.type}</span>
                      <span className="service-count">{service.count} service{service.count > 1 ? "s" : ""}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="service-arrow">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Aucun service actif</p>
                <a href="https://www.ovhcloud.com/fr/order/" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  Commander un service
                </a>
              </div>
            )}
          </Tile>

          {/* Actions rapides */}
          <div className="quick-actions-section">
            <h3 className="section-title">Actions rapides</h3>
            <div className="quick-actions">
              <button className="action-card" onClick={() => handleNavigate("home-billing", { tab: "bills" })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>Mes factures</span>
              </button>
              <button className="action-card" onClick={() => handleNavigate("home-account")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Mon compte</span>
              </button>
              <button className="action-card" onClick={() => handleNavigate("home-support")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span>Assistance</span>
              </button>
              <a href="https://www.ovhcloud.com/fr/order/" target="_blank" rel="noopener noreferrer" className="action-card highlight">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Commander</span>
              </a>
            </div>
          </div>
        </div>

        {/* Colonne droite - Infos */}
        <div className="dashboard-sidebar">
          {/* Dernière facture */}
          <Tile
            title="Derniere facture"
            loading={loading.billing}
            error={errors.billing}
            onRetry={loadBilling}
            skeleton={<SkeletonBillCard />}
            className="tile-bill"
          >
            {lastBill ? (
              <div className="bill-content">
                <div className="bill-header">
                  <span className="bill-id">{lastBill.billId}</span>
                  <span className="bill-amount">{lastBill.priceWithTax.text}</span>
                </div>
                <span className="bill-date">{formatDate(lastBill.date)}</span>
                <div className="bill-actions">
                  <a href={lastBill.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    Telecharger PDF
                  </a>
                  <button className="btn btn-sm btn-outline" onClick={() => handleNavigate("home-billing", { tab: "bills" })}>
                    Voir tout
                  </button>
                </div>
              </div>
            ) : (
              <p className="empty-text">Aucune facture</p>
            )}
          </Tile>

          {/* Suivi commande */}
          {alerts?.lastOrder && (
            <Tile title="Derniere commande" className="tile-order">
              <div className="order-content">
                <div className="order-header">
                  <span className="order-id">#{alerts.lastOrder.order.orderId}</span>
                  <span className="order-status">{alerts.lastOrder.order.status}</span>
                </div>
                <div className="order-details">
                  <span className="order-date">{formatDateShort(alerts.lastOrder.order.date)}</span>
                  <span className="order-amount">{alerts.lastOrder.order.priceWithTax.text}</span>
                </div>
                {alerts.lastOrder.tracking?.progress !== undefined && (
                  <div className="order-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${alerts.lastOrder.tracking.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </Tile>
          )}

          {/* Notifications */}
          {alerts?.notifications && alerts.notifications.length > 0 && (
            <Tile title="Notifications" className="tile-notifications">
              <div className="notifications-list">
                {alerts.notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className={`notification-item notification-${notif.level}`}>
                    <span className="notification-dot" />
                    <div className="notification-content">
                      <span className="notification-subject">{notif.subject}</span>
                      <span className="notification-date">{formatDateShort(notif.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Tile>
          )}

          {/* Support */}
          {alerts?.openTickets && alerts.openTickets.length > 0 && (
            <Tile title="Tickets en cours" className="tile-support">
              <div className="support-list">
                {alerts.openTickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.ticketId} className="support-ticket">
                    <span className="ticket-subject">{ticket.subject}</span>
                    <span className="ticket-date">{formatDateShort(ticket.creationDate)}</span>
                  </div>
                ))}
              </div>
              <a href="https://help.ovhcloud.com/csm" className="tile-link" target="_blank" rel="noopener noreferrer">
                Voir tous les tickets →
              </a>
            </Tile>
          )}
        </div>
      </div>
    </div>
  );
}
