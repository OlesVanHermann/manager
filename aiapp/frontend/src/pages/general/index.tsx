// ============================================================
// HOME PAGE - Dashboard accueil OVHcloud (style Hub)
// ============================================================

import { useTranslation } from "react-i18next";
import { Tile, SkeletonServicesGrid, SkeletonBillCard } from "../../components/Skeleton";
import { ServiceIcon } from "../../components/ServiceIcons";
import { getUser, SERVICE_TYPE_MAP } from "./utils";
import { useHomeData } from "./useHomeData";
import { DashboardAlerts } from "./components";
import "./styles.css";

// ============ TYPES ============

interface HomeProps {
  onNavigate?: (section: string, options?: { serviceType?: string; tab?: string }) => void;
}

// ============ COMPOSANT ============

/** Dashboard accueil avec services, facturation et alertes. */
export default function Home({ onNavigate }: HomeProps) {
  const { t, i18n } = useTranslation('general/dashboard');
  const user = getUser();
  const { services, lastBill, debtAmount, alerts, loading, errors, loadServices, loadBilling } = useHomeData();

  // ---------- FORMATTERS ----------
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      day: "numeric",
      month: "short",
    });
  };

  // ---------- HANDLERS ----------
  const handleNavigate = (section: string, options?: { serviceType?: string; tab?: string }) => {
    onNavigate?.(section, options);
  };

  const handleServiceClick = (serviceType: string) => {
    const filterType = SERVICE_TYPE_MAP[serviceType] || serviceType;
    handleNavigate("general-billing", { serviceType: filterType, tab: "services" });
  };

  // ---------- RENDER ----------
  return (
    <div className="dashboard-page">
      <DashboardAlerts
        alerts={alerts}
        user={user}
        debtAmount={debtAmount}
        loadingBilling={loading.billing}
        onNavigate={handleNavigate}
      />

      {/* Layout 2 colonnes */}
      <div className="dashboard-grid">
        {/* Colonne gauche - Services */}
        <div className="dashboard-main">
          {/* Services */}
          <Tile
            title={services ? t('services.titleWithCount', { count: services.total }) : t('services.title')}
            loading={loading.services}
            error={errors.services}
            onRetry={loadServices}
            skeleton={<SkeletonServicesGrid count={6} />}
            className="tile-services"
          >
            {services && services.types.length > 0 ? (
              <div className="services-grid">
                {services.types.map((service) => (
                  <button key={service.type} className="service-card" onClick={() => handleServiceClick(service.type)}>
                    <div className="service-icon-wrapper">
                      <ServiceIcon serviceType={service.type} size={32} className="service-icon" />
                    </div>
                    <div className="service-info">
                      <span className="service-name">{service.type}</span>
                      <span className="service-count">{t('services.serviceCount', { count: service.count })}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="service-arrow">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>{t('services.empty')}</p>
                <a href="https://www.ovhcloud.com/fr/order/" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  {t('services.orderButton')}
                </a>
              </div>
            )}
          </Tile>

          {/* Actions rapides */}
          <div className="quick-actions-section">
            <h3 className="section-title">{t('quickActions.title')}</h3>
            <div className="quick-actions">
              <button className="action-card" onClick={() => handleNavigate("general-billing", { tab: "invoices" })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>{t('quickActions.invoices')}</span>
              </button>
              <button className="action-card" onClick={() => handleNavigate("general-account")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>{t('quickActions.account')}</span>
              </button>
              <button className="action-card" onClick={() => handleNavigate("general-support")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span>{t('quickActions.support')}</span>
              </button>
              <a href="https://www.ovhcloud.com/fr/order/" target="_blank" rel="noopener noreferrer" className="action-card highlight">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>{t('quickActions.order')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Colonne droite - Infos */}
        <div className="dashboard-sidebar">
          {/* Dernière facture */}
          <Tile
            title={t('lastBill.title')}
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
                    {t('lastBill.downloadPdf')}
                  </a>
                  <button className="btn btn-sm btn-outline" onClick={() => handleNavigate("general-billing", { tab: "invoices" })}>
                    {t('lastBill.viewAll')}
                  </button>
                </div>
              </div>
            ) : (
              <p className="empty-text">{t('lastBill.empty')}</p>
            )}
          </Tile>

          {/* Suivi commande */}
          {alerts?.lastOrder && (
            <Tile title={t('lastOrder.title')} className="tile-order">
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
            <Tile title={t('notifications.title')} className="tile-notifications">
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
            <Tile title={t('openTickets.title')} className="tile-support">
              <div className="support-list">
                {alerts.openTickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.ticketId} className="support-ticket">
                    <span className="ticket-subject">{ticket.subject}</span>
                    <span className="ticket-date">{formatDateShort(ticket.creationDate)}</span>
                  </div>
                ))}
              </div>
              <a href="https://help.ovhcloud.com/csm" className="tile-link" target="_blank" rel="noopener noreferrer">
                {t('openTickets.viewAll')} →
              </a>
            </Tile>
          )}
        </div>
      </div>
    </div>
  );
}
