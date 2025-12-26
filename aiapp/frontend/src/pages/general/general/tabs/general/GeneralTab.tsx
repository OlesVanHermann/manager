// ============================================================
// GENERAL TAB - Dashboard accueil OVHcloud (style Hub)
// NAV1: general / NAV2: general / NAV3: general
// ISOLÉ - Aucune dépendance vers d'autres tabs
// Préfixe CSS: .general-general-
// ============================================================

import { useTranslation } from "react-i18next";
import { Tile, SkeletonServicesGrid, SkeletonBillCard } from "../../../../../components/Skeleton";
import { ServiceIcon } from "../../../../../components/ServiceIcons";
import { getUser, SERVICE_TYPE_MAP, useHomeData, type UserInfo, type DashboardAlerts } from "./GeneralTab.service";
import "./GeneralTab.css";

// ============ TYPES ============

interface HomeProps {
  onNavigate?: (section: string, options?: { serviceType?: string; tab?: string }) => void;
}

interface DashboardAlertsProps {
  alerts: DashboardAlerts | null;
  user: UserInfo | null;
  debtAmount: number;
  loadingBilling: boolean;
  onNavigate: (section: string, options?: { tab?: string }) => void;
}

// ============ SOUS-COMPOSANT : ALERTS ============

/** Affiche les bannières système, alerte KYC, welcome et alerte dette. */
function GeneralAlerts({ alerts, user, debtAmount, loadingBilling, onNavigate }: DashboardAlertsProps) {
  const { t } = useTranslation('general/general/general');

  return (
    <>
      {/* Welcome */}
      <div className="general-general-dashboard-welcome">
        <div className="general-general-welcome-content">
          <h1>{t('welcome.greeting', { name: user?.firstname || '' })}</h1>
          <p className="general-general-welcome-subtitle">{t('welcome.subtitle')}</p>
        </div>
        {user?.isTrusted && (
          <span className="badge badge-success general-trusted-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="general-general-badge-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            {t('welcome.securedAccount')}
          </span>
        )}
      </div>

      {/* Alerte dette */}
      {!loadingBilling && debtAmount > 0 && (
        <div className="general-general-debt-alert">
          <span className="general-general-debt-icon">⚠️</span>
          <span className="general-general-debt-message" dangerouslySetInnerHTML={{ __html: t('debt.message', { amount: debtAmount.toFixed(2) }) }} />
          <button className="general-general-debt-pay-btn" onClick={() => onNavigate("general-general-billing", { tab: "payments" })}>
            {t('debt.payButton')}
          </button>
        </div>
      )}
    </>
  );
}

// ============ COMPOSANT PRINCIPAL ============

/** Dashboard accueil avec services, facturation et alertes. */
export function GeneralTab({ onNavigate }: HomeProps) {
  const { t, i18n } = useTranslation('general/general/general');
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
    handleNavigate("general-general-billing", { serviceType: filterType, tab: "services" });
  };

  // ---------- RENDER ----------
  return (
    <div className="general-general-container">
      <GeneralAlerts
        alerts={alerts}
        user={user}
        debtAmount={debtAmount}
        loadingBilling={loading.billing}
        onNavigate={handleNavigate}
      />

      {/* Layout 2 colonnes */}
      <div className="general-general-dashboard-grid">
        {/* Colonne gauche - Services */}
        <div className="general-general-dashboard-main">
          {/* Services */}
          <Tile
            title={services ? t('services.titleWithCount', { count: services.total }) : t('services.title')}
            loading={loading.services}
            error={errors.services}
            onRetry={loadServices}
            skeleton={<SkeletonServicesGrid count={6} />}
            className="general-general-tile-services"
          >
            {services && services.types.length > 0 ? (
              <div className="general-general-services-grid">
                {services.types.map((service) => (
                  <button key={service.type} className="general-general-service-card" onClick={() => handleServiceClick(service.type)}>
                    <div className="general-general-service-icon-wrapper">
                      <ServiceIcon serviceType={service.type} size={32} className="general-general-service-icon" />
                    </div>
                    <div className="general-general-service-info">
                      <span className="general-general-service-name">{service.type}</span>
                      <span className="general-general-service-count">{t('services.serviceCount', { count: service.count })}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="general-general-service-arrow">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              <div className="general-general-empty-state">
                <p>{t('services.empty')}</p>
                <a href="https://www.ovhcloud.com/fr/order/" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  {t('services.orderButton')}
                </a>
              </div>
            )}
          </Tile>

          {/* Actions rapides */}
          <div className="general-general-quick-actions-section">
            <h3 className="general-general-section-title">{t('quickActions.title')}</h3>
            <div className="general-general-quick-actions">
              <button className="general-general-action-card" onClick={() => handleNavigate("general-general-billing", { tab: "invoices" })}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>{t('quickActions.invoices')}</span>
              </button>
              <button className="general-general-action-card" onClick={() => handleNavigate("general-general-account")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>{t('quickActions.account')}</span>
              </button>
              <button className="general-general-action-card" onClick={() => handleNavigate("general-general-support")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <span>{t('quickActions.support')}</span>
              </button>
              <a href="https://www.ovhcloud.com/fr/order/" target="_blank" rel="noopener noreferrer" className="general-general-action-card general-action-highlight">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>{t('quickActions.order')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Colonne droite - Infos */}
        <div className="general-general-dashboard-sidebar">
          {/* Dernière facture */}
          <Tile
            title={t('lastBill.title')}
            loading={loading.billing}
            error={errors.billing}
            onRetry={loadBilling}
            skeleton={<SkeletonBillCard />}
            className="general-general-tile-bill"
          >
            {lastBill ? (
              <div className="general-general-bill-content">
                <div className="general-general-bill-header">
                  <span className="general-general-bill-id">{lastBill.billId}</span>
                  <span className="general-general-bill-amount">{lastBill.priceWithTax.text}</span>
                </div>
                <span className="general-general-bill-date">{formatDate(lastBill.date)}</span>
                <div className="general-general-bill-actions">
                  <a href={lastBill.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                    {t('lastBill.downloadPdf')}
                  </a>
                  <button className="btn btn-sm btn-outline" onClick={() => handleNavigate("general-general-billing", { tab: "invoices" })}>
                    {t('lastBill.viewAll')}
                  </button>
                </div>
              </div>
            ) : (
              <p className="general-general-empty-text">{t('lastBill.empty')}</p>
            )}
          </Tile>

          {/* Suivi commande */}
          {alerts?.lastOrder && (
            <Tile title={t('lastOrder.title')} className="general-general-tile-order">
              <div className="general-general-order-content">
                <div className="general-general-order-header">
                  <span className="general-general-order-id">#{alerts.lastOrder.order.orderId}</span>
                  <span className="general-general-order-status">{alerts.lastOrder.order.status}</span>
                </div>
                <div className="general-general-order-details">
                  <span className="general-general-order-date">{formatDateShort(alerts.lastOrder.order.date)}</span>
                  <span className="general-general-order-amount">{alerts.lastOrder.order.priceWithTax.text}</span>
                </div>
                {alerts.lastOrder.tracking?.progress !== undefined && (
                  <div className="general-general-order-progress">
                    <div className="general-general-progress-bar">
                      <div className="general-general-progress-fill" style={{ width: `${alerts.lastOrder.tracking.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </Tile>
          )}

          {/* Notifications */}
          {alerts?.notifications && alerts.notifications.length > 0 && (
            <Tile title={t('notifications.title')} className="general-general-tile-notifications">
              <div className="general-general-notifications-list">
                {alerts.notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className={`general-notification-item general-notification-${notif.level}`}>
                    <span className="general-general-notification-dot" />
                    <div className="general-general-notification-content">
                      <span className="general-general-notification-subject">{notif.subject}</span>
                      <span className="general-general-notification-date">{formatDateShort(notif.date)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Tile>
          )}

          {/* Support */}
          {alerts?.openTickets && alerts.openTickets.length > 0 && (
            <Tile title={t('openTickets.title')} className="general-general-tile-support">
              <div className="general-general-support-list">
                {alerts.openTickets.slice(0, 3).map((ticket) => (
                  <div key={ticket.ticketId} className="general-general-support-ticket">
                    <span className="general-general-ticket-subject">{ticket.subject}</span>
                    <span className="general-general-ticket-date">{formatDateShort(ticket.creationDate)}</span>
                  </div>
                ))}
              </div>
              <a href="https://help.ovhcloud.com/csm" className="general-general-tile-link" target="_blank" rel="noopener noreferrer">
                {t('openTickets.viewAll')} →
              </a>
            </Tile>
          )}
        </div>
      </div>
    </div>
  );
}
