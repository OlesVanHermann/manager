// ============================================================
// DASHBOARD ALERTS - Bannières et alertes du dashboard
// ============================================================

import { useTranslation } from "react-i18next";
import type * as homeService from "../home.service";
import type { UserInfo } from "../utils";

// ============ TYPES ============

interface DashboardAlertsProps {
  alerts: homeService.DashboardAlerts | null;
  user: UserInfo | null;
  debtAmount: number;
  loadingBilling: boolean;
  onNavigate: (section: string, options?: { tab?: string }) => void;
}

// ============ COMPOSANT ============

/** Affiche les bannières système, alerte KYC, welcome et alerte dette. */
export function DashboardAlerts({ alerts, user, debtAmount, loadingBilling, onNavigate }: DashboardAlertsProps) {
  const { t } = useTranslation('general/dashboard');

  return (
    <>
      {/* Bannières système */}
      {alerts?.banners && alerts.banners.length > 0 && (
        <div className="banners-container">
          {alerts.banners.map((banner) => (
            <div key={banner.id} className={`banner-alert banner-${banner.level}`}>
              <span className="banner-message">{banner.message}</span>
              {banner.linkUrl && (
                <a href={banner.linkUrl} className="banner-link" target="_blank" rel="noopener noreferrer">
                  {banner.linkLabel || t('banners.learnMore')}
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
              ? t('kyc.pending')
              : alerts.kycStatus.status === "rejected"
              ? t('kyc.rejected')
              : t('kyc.required')}
          </span>
          <button className="kyc-link" onClick={() => onNavigate("general-account", { tab: "kyc" })}>
            {t('kyc.complete')}
          </button>
        </div>
      )}

      {/* Welcome */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>{t('welcome.greeting', { name: user?.firstname || '' })}</h1>
          <p className="welcome-subtitle">{t('welcome.subtitle')}</p>
        </div>
        {user?.isTrusted && (
          <span className="badge badge-success trusted-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="badge-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            {t('welcome.securedAccount')}
          </span>
        )}
      </div>

      {/* Alerte dette */}
      {!loadingBilling && debtAmount > 0 && (
        <div className="debt-alert">
          <span className="debt-icon">⚠️</span>
          <span className="debt-message" dangerouslySetInnerHTML={{ __html: t('debt.message', { amount: debtAmount.toFixed(2) }) }} />
          <button className="debt-pay-btn" onClick={() => onNavigate("general-billing", { tab: "payments" })}>
            {t('debt.payButton')}
          </button>
        </div>
      )}
    </>
  );
}
