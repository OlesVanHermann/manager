import { useState, useEffect } from "react";
import * as billingService from "../../services/billing.service";
import "./styles.css";

// ============ TYPES ============

interface BillingPageProps {
  isActive: boolean;
  initialTab?: string;
}

// ============ TABS DEFINITION ============

const tabs = [
  { id: "invoices", label: "Factures" },
  { id: "payments", label: "Suivi des paiements" },
  { id: "credits", label: "Mes avoirs" },
  { id: "methods", label: "Moyens de paiement" },
  { id: "prepaid", label: "Compte prepaye" },
  { id: "vouchers", label: "Bons d'achat" },
  { id: "fidelity", label: "Points de fidelite" },
];

// ============ CREDENTIALS HOOK ============

function useCredentials() {
  const [credentials, setCredentials] = useState<billingService.OvhCredentials | null>(null);

  useEffect(() => {
    const creds = billingService.getStoredCredentials();
    setCredentials(creds);
  }, []);

  return credentials;
}

// ============ HELPER: Check if error is 404/not found ============

function isNotFoundError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes("404") || msg.includes("not found") || msg.includes("does not exist");
  }
  return false;
}

// ============ MAIN COMPONENT ============

export function BillingPage({ isActive, initialTab = "invoices" }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const credentials = useCredentials();

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  if (!isActive) return null;

  const currentIdx = tabs.findIndex((t) => t.id === activeTab);

  if (!credentials) {
    return (
      <div className="billing-page">
        <div className="billing-header">
          <div className="billing-header-content">
            <h1>Mes factures</h1>
            <p className="billing-subtitle">Connectez-vous pour acceder a vos factures et moyens de paiement.</p>
          </div>
        </div>
        <div className="billing-content">
          <div className="empty-state">
            <LockIcon />
            <h3>Authentification requise</h3>
            <p>Veuillez vous connecter avec vos identifiants OVH pour acceder a cette section.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="billing-header">
        <div className="billing-header-content">
          <h1>Mes factures</h1>
          <p className="billing-subtitle">
            Retrouvez et telechargez vos factures. Suivez l'etat de vos paiements. Gerez vos moyens de paiement.
          </p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-billing-faq" target="_blank" rel="noopener noreferrer" className="guides-link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          Guides
        </a>
      </div>

      <div className="billing-tabs">
        <button
          className="tab-nav-btn prev"
          disabled={currentIdx <= 0}
          onClick={() => { if (currentIdx > 0) setActiveTab(tabs[currentIdx - 1].id); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
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
        <button
          className="tab-nav-btn next"
          disabled={currentIdx >= tabs.length - 1}
          onClick={() => { if (currentIdx < tabs.length - 1) setActiveTab(tabs[currentIdx + 1].id); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <div className="billing-content">
        {activeTab === "invoices" && <InvoicesTab credentials={credentials} />}
        {activeTab === "payments" && <PaymentsTab credentials={credentials} />}
        {activeTab === "credits" && <CreditsTab credentials={credentials} />}
        {activeTab === "methods" && <MethodsTab credentials={credentials} />}
        {activeTab === "prepaid" && <PrepaidTab credentials={credentials} />}
        {activeTab === "vouchers" && <VouchersTab credentials={credentials} />}
        {activeTab === "fidelity" && <FidelityTab credentials={credentials} />}
      </div>
    </div>
  );
}

// ============ TAB PROPS ============

interface TabProps {
  credentials: billingService.OvhCredentials;
}

// ============ FACTURES TAB ============

function InvoicesTab({ credentials }: TabProps) {
  const [bills, setBills] = useState<billingService.Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("6");

  useEffect(() => { loadBills(); }, [period]);

  const loadBills = async () => {
    setLoading(true);
    setError(null);
    try {
      const months = parseInt(period);
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - months);
      const data = await billingService.getBills(credentials, { "date.from": dateFrom.toISOString().split("T")[0], limit: 100 });
      setBills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatAmount = (v: number, c: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);
  const totalHT = bills.reduce((s, b) => s + b.priceWithoutTax.value, 0);
  const totalTTC = bills.reduce((s, b) => s + b.priceWithTax.value, 0);
  const currency = bills[0]?.priceWithTax.currencyCode || "EUR";

  return (
    <div className="tab-panel">
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1">1 mois</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
            <option value="24">24 mois</option>
          </select>
          <span className="result-count">{loading ? "Chargement..." : `${bills.length} facture(s)`}</span>
        </div>
        <div className="toolbar-right">
          <span className="total-label">Total HT: <strong>{formatAmount(totalHT, currency)}</strong></span>
          <span className="total-label">Total TTC: <strong>{formatAmount(totalTTC, currency)}</strong></span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement des factures...</p></div>
      ) : bills.length === 0 ? (
        <div className="empty-state"><EmptyIcon /><h3>Aucune facture</h3><p>Aucune facture sur cette periode</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
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
                  <td className="ref-cell"><span className="ref-badge">{bill.billId}</span></td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{bill.priceWithoutTax.text}</td>
                  <td className="amount-cell">{bill.priceWithTax.text}</td>
                  <td className="actions-cell">
                    {bill.pdfUrl && <a href={bill.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Telecharger PDF"><DownloadIcon /></a>}
                    {bill.url && <a href={bill.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ PAIEMENTS TAB ============

function PaymentsTab({ credentials }: TabProps) {
  const [deposits, setDeposits] = useState<billingService.Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("6");

  useEffect(() => { loadDeposits(); }, [period]);

  const loadDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const months = parseInt(period);
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - months);
      const data = await billingService.getDeposits(credentials, { "date.from": dateFrom.toISOString().split("T")[0], limit: 100 });
      setDeposits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatAmount = (v: number, c: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);
  const total = deposits.reduce((s, d) => s + d.amount.value, 0);
  const currency = deposits[0]?.amount.currencyCode || "EUR";

  return (
    <div className="tab-panel">
      <div className="info-box">
        <p>La liste suivante presente les paiements realises sur votre moyen de paiement par defaut. Chaque paiement peut regrouper une ou plusieurs factures.</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1">1 mois</option>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">12 mois</option>
            <option value="24">24 mois</option>
          </select>
          <span className="result-count">{loading ? "Chargement..." : `${deposits.length} paiement(s)`}</span>
        </div>
        <div className="toolbar-right">
          <span className="total-label">Total: <strong>{formatAmount(total, currency)}</strong></span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement des paiements...</p></div>
      ) : deposits.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>Aucun paiement</h3><p>Aucun paiement sur cette periode</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
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
              {deposits.map((dep) => (
                <tr key={dep.depositId}>
                  <td className="ref-cell"><span className="ref-badge">{dep.depositId}</span></td>
                  <td>{formatDate(dep.date)}</td>
                  <td className="amount-cell">{dep.amount.text}</td>
                  <td>{dep.paymentInfo?.description || dep.paymentInfo?.paymentType || "-"}</td>
                  <td className="actions-cell">
                    {dep.pdfUrl && <a href={dep.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Telecharger PDF"><DownloadIcon /></a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ AVOIRS TAB ============

function CreditsTab({ credentials }: TabProps) {
  const [credits, setCredits] = useState<billingService.Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("6");

  useEffect(() => { loadCredits(); }, [period]);

  const loadCredits = async () => {
    setLoading(true);
    setError(null);
    try {
      const months = parseInt(period);
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - months);
      const data = await billingService.getCredits(credentials, { "date.from": dateFrom.toISOString().split("T")[0], limit: 100 });
      setCredits(data);
    } catch (err) {
      // 404 = pas d'avoirs, ce n'est pas une erreur
      if (isNotFoundError(err)) {
        setCredits([]);
      } else {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="tab-panel">
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="3">3 mois</option>
            <option value="6">6 mois</option>
            <option value="12">1 an</option>
          </select>
          <span className="result-count">{loading ? "Chargement..." : `${credits.length} avoir(s)`}</span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement des avoirs...</p></div>
      ) : credits.length === 0 ? (
        <div className="empty-state"><EmptyIcon /><h3>Aucun avoir</h3><p>Vous n'avez pas d'avoir pour la periode selectionnee</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Associe a la facture</th>
                <th>Montant TTC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {credits.map((credit) => (
                <tr key={credit.refundId}>
                  <td>{formatDate(credit.date)}</td>
                  <td className="ref-cell"><span className="ref-badge">{credit.refundId}</span></td>
                  <td>{credit.originalBillId || "-"}</td>
                  <td className="amount-cell">{credit.amount.text}</td>
                  <td className="actions-cell">
                    {credit.pdfUrl && <a href={credit.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Telecharger PDF"><DownloadIcon /></a>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ MOYENS DE PAIEMENT TAB ============

function MethodsTab({ credentials }: TabProps) {
  const [methods, setMethods] = useState<billingService.PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadMethods(); }, []);

  const loadMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getPaymentMethods(credentials);
      setMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const getStatusLabel = (s: string) => ({ VALID: "Actif", PENDING: "En attente", BLOCKED: "Bloque", EXPIRED: "Expire", CANCELED: "Annule" }[s] || s);
  const getStatusClass = (s: string) => s === "VALID" ? "status-success" : s === "PENDING" ? "status-warning" : "status-danger";

  return (
    <div className="tab-panel">
      <div className="info-box">
        <p>Lorsque vous enregistrez un moyen de paiement, vous autorisez OVH S.A.S a le conserver afin de faciliter le reglement de vos commandes futures. Le moyen de paiement « par defaut » est utilise automatiquement a chaque echeance.</p>
      </div>
      <div className="toolbar">
        <div className="toolbar-left">
          <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary">+ Ajouter un moyen de paiement</a>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement des moyens de paiement...</p></div>
      ) : methods.length === 0 ? (
        <div className="empty-state"><CardIcon /><h3>Aucun moyen de paiement</h3><p>Vous n'avez pas encore enregistre de moyen de paiement</p></div>
      ) : (
        <div className="methods-grid">
          {methods.map((method) => (
            <div key={method.paymentMethodId} className={`method-card ${method.default ? "default" : ""}`}>
              <div className="method-icon">{method.icon?.url ? <img src={method.icon.url} alt={method.paymentType} /> : <CardIcon />}</div>
              <div className="method-info">
                <h4>{method.paymentType} {method.paymentSubType ? `(${method.paymentSubType})` : ""}</h4>
                <p>{method.description || method.label}</p>
                {method.expirationDate && <span className="method-expiry">Expire le {formatDate(method.expirationDate)}</span>}
              </div>
              <div className="method-status">
                <span className={`status-badge ${getStatusClass(method.status)}`}>{getStatusLabel(method.status)}</span>
                {method.default && <span className="default-badge">Par defaut</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ COMPTE PREPAYE TAB ============

function PrepaidTab({ credentials }: TabProps) {
  const [account, setAccount] = useState<billingService.OvhAccount | null>(null);
  const [movements, setMovements] = useState<billingService.OvhAccountMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPrepaid(); }, []);

  const loadPrepaid = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const ids = await billingService.getOvhAccountIds(credentials);
      if (ids.length > 0) {
        const acc = await billingService.getOvhAccount(credentials, ids[0]);
        setAccount(acc);
        const mvts = await billingService.getOvhAccountMovements(credentials, ids[0]);
        setMovements(mvts);
      } else {
        // Pas de compte prepaye pour ce client
        setNotAvailable(true);
      }
    } catch (err) {
      if (isNotFoundError(err)) {
        setNotAvailable(true);
      } else {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  }

  if (notAvailable) {
    return (
      <div className="tab-panel">
        <div className="empty-state">
          <WalletIcon />
          <h3>Compte prepaye non disponible</h3>
          <p>Le compte prepaye n'est pas active pour votre compte OVH.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-panel">
      <div className="balance-card">
        <h3>Solde du compte prepaye</h3>
        <div className="balance-amount">{account?.balance.text || "0,00 €"}</div>
        <p className="balance-info">Le compte prepaye permet de payer vos factures OVHcloud. Vous pouvez le crediter a tout moment.</p>
        <a href="https://www.ovh.com/manager/#/dedicated/billing/ovhaccount/credit" target="_blank" rel="noopener noreferrer" className="btn btn-white">Crediter mon compte</a>
      </div>

      <h4>Historique des mouvements</h4>
      {movements.length === 0 ? (
        <div className="empty-state small"><p>Aucun mouvement</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Description</th><th>Montant</th><th>Solde</th></tr></thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.movementId}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.description}</td>
                  <td className={m.amount.value >= 0 ? "amount-positive" : "amount-negative"}>{m.amount.text}</td>
                  <td>{m.balance.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ BONS D'ACHAT TAB ============

function VouchersTab({ credentials }: TabProps) {
  const [vouchers, setVouchers] = useState<billingService.Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadVouchers(); }, []);

  const loadVouchers = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const data = await billingService.getVouchers(credentials);
      setVouchers(data);
    } catch (err) {
      if (isNotFoundError(err)) {
        setNotAvailable(true);
      } else {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des bons d'achat...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  }

  return (
    <div className="tab-panel">
      <div className="info-box">
        <p>Les bons d'achat sont des credits offerts par OVHcloud utilisables pour vos prochaines commandes.</p>
      </div>

      {notAvailable ? (
        <div className="empty-state">
          <GiftIcon />
          <h3>Aucun bon d'achat</h3>
          <p>Vous n'avez pas de bon d'achat actif sur votre compte.</p>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="empty-state">
          <GiftIcon />
          <h3>Aucun bon d'achat</h3>
          <p>Aucun bon d'achat disponible</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Code</th><th>Solde</th><th>Date d'ouverture</th><th>Derniere mise a jour</th></tr></thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.voucherAccount}>
                  <td className="ref-cell"><span className="ref-badge">{v.voucherAccount}</span></td>
                  <td className="amount-cell">{v.balance.text}</td>
                  <td>{formatDate(v.creationDate)}</td>
                  <td>{formatDate(v.lastUpdate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ FIDELITE TAB ============

function FidelityTab({ credentials }: TabProps) {
  const [account, setAccount] = useState<billingService.FidelityAccount | null>(null);
  const [movements, setMovements] = useState<billingService.FidelityMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadFidelity(); }, []);

  const loadFidelity = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const acc = await billingService.getFidelityAccount(credentials);
      setAccount(acc);
      const mvts = await billingService.getFidelityMovements(credentials);
      setMovements(mvts);
    } catch (err) {
      // 404 = programme de fidelite non disponible pour ce compte
      if (isNotFoundError(err)) {
        setNotAvailable(true);
      } else {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) {
    return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  }

  if (error) {
    return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  }

  if (notAvailable) {
    return (
      <div className="tab-panel">
        <div className="empty-state">
          <StarIcon />
          <h3>Programme de fidelite non disponible</h3>
          <p>Le programme de fidelite n'est pas active pour votre compte OVH.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-panel">
      <div className="points-card">
        <h3>Mes points de fidelite</h3>
        <div className="points-amount">{account?.balance || 0} points</div>
        <p className="points-info">Cumulez des points a chaque commande et convertissez-les en reduction sur vos prochains achats.</p>
        {account?.canBeCredited && (
          <a href="https://www.ovh.com/manager/#/dedicated/billing/fidelity/creditOrder" target="_blank" rel="noopener noreferrer" className="btn btn-white">Utiliser mes points</a>
        )}
      </div>

      <h4>Historique des points</h4>
      {movements.length === 0 ? (
        <div className="empty-state small"><p>Aucun historique de points</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Operation</th><th>Credit</th><th>Debit</th><th>Solde</th></tr></thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.movementId}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.description}</td>
                  <td className="amount-positive">{m.previousBalance < m.balance ? `${m.amount} pts` : "-"}</td>
                  <td className="amount-negative">{m.previousBalance >= m.balance ? `${Math.abs(m.amount)} pts` : "-"}</td>
                  <td>{m.balance} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ ICONS ============

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18a1.5 1.5 0 001.5-1.5v-1.5a1.5 1.5 0 00-1.5-1.5h-18a1.5 1.5 0 00-1.5 1.5v1.5a1.5 1.5 0 001.5 1.5z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default BillingPage;
