import { useState, useEffect } from "react";
import * as billingService from "../../services/billing.service";
import type { OvhCredentials } from "../../types/auth.types";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

interface BillingPageProps {
  isActive?: boolean;
  initialTab?: string;
}

export default function BillingPage({ isActive, initialTab = "history" }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [bills, setBills] = useState<billingService.Bill[]>([]);
  const [deposits, setDeposits] = useState<billingService.Deposit[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<billingService.PaymentMethod[]>([]);
  const [debtAccount, setDebtAccount] = useState<billingService.DebtAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("6");

  const tabs = [
    { id: "history", label: "Historique des factures" },
    { id: "payments", label: "Suivi des paiements" },
    { id: "methods", label: "Moyens de paiement" },
    { id: "unpaid", label: "Mon encours" },
  ];

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isActive) return;
    loadData();
  }, [isActive, selectedPeriod, activeTab]);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadData = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeTab === "history") {
        const months = parseInt(selectedPeriod);
        const dateFrom = new Date();
        dateFrom.setMonth(dateFrom.getMonth() - months);
        
        const fetchedBills = await billingService.getBills(credentials, {
          "date.from": dateFrom.toISOString().split("T")[0],
          limit: 50,
        });
        setBills(fetchedBills);
      } else if (activeTab === "payments") {
        const months = parseInt(selectedPeriod);
        const dateFrom = new Date();
        dateFrom.setMonth(dateFrom.getMonth() - months);
        
        const fetchedDeposits = await billingService.getDeposits(credentials, {
          "date.from": dateFrom.toISOString().split("T")[0],
          limit: 50,
        });
        setDeposits(fetchedDeposits);
      } else if (activeTab === "methods") {
        const methods = await billingService.getPaymentMethods(credentials);
        setPaymentMethods(methods);
      } else if (activeTab === "unpaid") {
        const account = await billingService.getDebtAccount(credentials);
        setDebtAccount(account);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const totalBillsAmount = bills.reduce((sum, bill) => sum + bill.priceWithTax.value, 0);
  const totalDepositsAmount = deposits.reduce((sum, dep) => sum + dep.amount.value, 0);
  const currency = bills[0]?.priceWithTax.currencyCode || deposits[0]?.amount.currencyCode || "EUR";

  const formatAmount = (amount: number, curr: string) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: curr }).format(amount);
  };

  const getPaymentIcon = (type: string) => {
    if (type.toLowerCase().includes("card") || type.toLowerCase().includes("visa") || type.toLowerCase().includes("mastercard")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
      );
    }
    if (type.toLowerCase().includes("paypal")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      );
    }
    if (type.toLowerCase().includes("sepa") || type.toLowerCase().includes("bank")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    );
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      VALID: "Actif",
      PENDING: "En attente",
      BLOCKED: "Bloque",
      EXPIRED: "Expire",
      CANCELED: "Annule",
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    if (status === "VALID") return "badge-success";
    if (status === "PENDING") return "badge-warning";
    return "badge-danger";
  };

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div className="billing-header-content">
          <h1>Mes factures</h1>
          <p className="billing-subtitle">
            Consultez et telechargez vos factures, suivez vos paiements et gerez vos moyens de paiement.
          </p>
        </div>
      </div>

      <div className="billing-tabs">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadData}>Reessayer</button>
        </div>
      )}

      {/* HISTORIQUE DES FACTURES */}
      {activeTab === "history" && (
        <div className="billing-content">
          <div className="billing-toolbar">
            <div className="toolbar-left">
              <select 
                className="period-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="1">1 mois</option>
                <option value="3">3 mois</option>
                <option value="6">6 mois</option>
                <option value="12">12 mois</option>
                <option value="24">24 mois</option>
              </select>
              <span className="bill-count">
                {loading ? "Chargement..." : `${bills.length} factures`}
              </span>
            </div>
            <div className="toolbar-right">
              <span className="total-label">Total periode :</span>
              <span className="total-amount">
                {loading ? "..." : formatAmount(totalBillsAmount, currency)}
              </span>
            </div>
          </div>

          <div className="bills-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement des factures...</p>
              </div>
            ) : bills.length === 0 ? (
              <div className="empty-state">
                <p>Aucune facture sur cette periode</p>
              </div>
            ) : (
              <table className="bills-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Montant HT</th>
                    <th>Montant TTC</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.billId}>
                      <td className="ref-cell">
                        <span className="bill-ref">{bill.billId}</span>
                      </td>
                      <td>{formatDate(bill.date)}</td>
                      <td>{bill.priceWithoutTax.text}</td>
                      <td className="amount-cell">{bill.priceWithTax.text}</td>
                      <td className="actions-cell">
                        <a href={bill.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Telecharger PDF">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </a>
                        <a href={bill.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SUIVI DES PAIEMENTS */}
      {activeTab === "payments" && (
        <div className="billing-content">
          <div className="billing-toolbar">
            <div className="toolbar-left">
              <select 
                className="period-select"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="1">1 mois</option>
                <option value="3">3 mois</option>
                <option value="6">6 mois</option>
                <option value="12">12 mois</option>
                <option value="24">24 mois</option>
              </select>
              <span className="bill-count">
                {loading ? "Chargement..." : `${deposits.length} paiements`}
              </span>
            </div>
            <div className="toolbar-right">
              <span className="total-label">Total periode :</span>
              <span className="total-amount">
                {loading ? "..." : formatAmount(totalDepositsAmount, currency)}
              </span>
            </div>
          </div>

          <div className="bills-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Chargement des paiements...</p>
              </div>
            ) : deposits.length === 0 ? (
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>Aucun paiement</h3>
                <p>Aucun paiement sur cette periode</p>
              </div>
            ) : (
              <table className="bills-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Moyen de paiement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit) => (
                    <tr key={deposit.depositId}>
                      <td className="ref-cell">
                        <span className="bill-ref">{deposit.depositId}</span>
                      </td>
                      <td>{formatDate(deposit.date)}</td>
                      <td className="amount-cell">{deposit.amount.text}</td>
                      <td>{deposit.paymentInfo?.description || deposit.paymentInfo?.paymentType || "-"}</td>
                      <td className="actions-cell">
                        <a href={deposit.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Telecharger PDF">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* MOYENS DE PAIEMENT */}
      {activeTab === "methods" && (
        <div className="billing-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement des moyens de paiement...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="payment-methods">
              <div className="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <h3>Aucun moyen de paiement</h3>
                <p>Vous n'avez pas encore enregistre de moyen de paiement</p>
              </div>
              <button className="add-method-btn" onClick={() => window.open("https://www.ovh.com/manager/#/billing/payment/method/add", "_blank")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Ajouter un moyen de paiement
              </button>
            </div>
          ) : (
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div key={method.paymentMethodId} className="method-card">
                  <div className="method-icon">
                    {method.icon?.url ? (
                      <img src={method.icon.url} alt={method.paymentType} />
                    ) : (
                      getPaymentIcon(method.paymentType)
                    )}
                  </div>
                  <div className="method-info">
                    <h4>{method.paymentType} {method.paymentSubType ? `(${method.paymentSubType})` : ""}</h4>
                    <p>{method.description || method.label}</p>
                    {method.expirationDate && (
                      <span className="method-expiry">Expire le {formatDate(method.expirationDate)}</span>
                    )}
                  </div>
                  <div className="method-badges">
                    <span className={`status-badge ${getStatusClass(method.status)}`}>
                      {getStatusLabel(method.status)}
                    </span>
                    {method.default && <span className="method-default">Par defaut</span>}
                  </div>
                </div>
              ))}
              <button className="add-method-btn" onClick={() => window.open("https://www.ovh.com/manager/#/billing/payment/method/add", "_blank")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Ajouter un moyen de paiement
              </button>
            </div>
          )}
        </div>
      )}

      {/* MON ENCOURS */}
      {activeTab === "unpaid" && (
        <div className="billing-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Chargement...</p>
            </div>
          ) : debtAccount && debtAccount.dueAmount.value > 0 ? (
            <div className="debt-info">
              <div className="debt-summary">
                <div className="debt-card">
                  <span className="debt-label">Montant du</span>
                  <span className="debt-value danger">{debtAccount.dueAmount.text}</span>
                </div>
                <div className="debt-card">
                  <span className="debt-label">En attente de paiement</span>
                  <span className="debt-value">{debtAccount.pendingAmount.text}</span>
                </div>
                <div className="debt-card">
                  <span className="debt-label">A payer</span>
                  <span className="debt-value">{debtAccount.todoAmount.text}</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => window.open("https://www.ovh.com/manager/#/billing/payment", "_blank")}>
                Regulariser mon encours
              </button>
            </div>
          ) : (
            <div className="empty-state success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Aucun encours</h3>
              <p>Vous n'avez aucune facture impayee. Bravo !</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
