import { useState, useEffect } from "react";
import type { OvhCredentials, OvhUser } from "../types/auth.types";
import * as servicesService from "../services/services.service";
import * as billingService from "../services/billing.service";

const STORAGE_KEY = "ovh_credentials";

interface DashboardData {
  services: servicesService.ServiceSummary | null;
  lastBill: billingService.Bill | null;
  debtAmount: number;
}

function getCredentials(): OvhCredentials | null {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getUser(): OvhUser | null {
  const stored = sessionStorage.getItem("ovh_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatSupportLevel(level: string | undefined): string {
  if (!level) return "Standard";
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    services: null,
    lastBill: null,
    debtAmount: 0,
  });
  
  const user = getUser();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    try {
      // Charger en parallele
      const [services, bills, debt] = await Promise.all([
        servicesService.getServicesSummary(credentials).catch(() => null),
        billingService.getBills(credentials, { limit: 1 }).catch(() => []),
        billingService.getDebtAccount(credentials).catch(() => null),
      ]);

      setData({
        services,
        lastBill: bills.length > 0 ? bills[0] : null,
        debtAmount: debt?.dueAmount?.value || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <p>{error}</p>
          <button onClick={loadDashboard}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>Bonjour {user?.firstname || ""},</h1>
        <p className="welcome-subtitle">
          Bienvenue sur votre espace client OVHcloud
        </p>
        {user?.isTrusted && (
          <span className="badge badge-success trusted-badge">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="badge-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Compte securise
          </span>
        )}
      </div>

      {/* Quick Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon services">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{data.services?.total || 0}</span>
            <span className="stat-label">Services actifs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon billing">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{data.lastBill?.priceWithTax?.text || "-"}</span>
            <span className="stat-label">Derniere facture</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon support">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatSupportLevel(user?.supportLevel?.level)}</span>
            <span className="stat-label">Niveau de support</span>
          </div>
        </div>

        <div className={`stat-card ${data.debtAmount > 0 ? "warning" : ""}`}>
          <div className="stat-icon debt">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {data.debtAmount > 0 ? `${data.debtAmount.toFixed(2)} EUR` : "0,00 EUR"}
            </span>
            <span className="stat-label">Encours</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {data.services && data.services.types.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">Mes services</h2>
          <div className="services-grid">
            {data.services.types.map((service) => (
              <div key={service.type} className="service-card">
                <div className="service-header">
                  <span className="service-name">{service.type}</span>
                  <span className="service-count">{service.count}</span>
                </div>
                <div className="service-footer">
                  <a href="#" className="service-link">Voir tout</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Actions rapides</h2>
        <div className="quick-actions">
          <a href="#" className="action-card" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'billing' })); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span>Mes factures</span>
          </a>
          <a href="#" className="action-card" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'account' })); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Mon compte</span>
          </a>
          <a href="https://help.ovhcloud.com" target="_blank" rel="noopener noreferrer" className="action-card">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Documentation</span>
          </a>
          <a href="https://www.ovhcloud.com/fr/order/" target="_blank" rel="noopener noreferrer" className="action-card highlight">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Commander</span>
          </a>
        </div>
      </div>

      {/* Last Bill Details */}
      {data.lastBill && (
        <div className="dashboard-section">
          <h2 className="section-title">Derniere facture</h2>
          <div className="last-bill-card">
            <div className="bill-info">
              <span className="bill-id">{data.lastBill.billId}</span>
              <span className="bill-date">{formatDate(data.lastBill.date)}</span>
            </div>
            <div className="bill-amount">{data.lastBill.priceWithTax.text}</div>
            <a href={data.lastBill.pdfUrl} target="_blank" rel="noopener noreferrer" className="bill-download">
              Telecharger PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
