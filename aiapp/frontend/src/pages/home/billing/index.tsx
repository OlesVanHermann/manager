// ============================================================
// BILLING PAGE - Facturation
// 11 Tabs: Services, Factures, Avoirs, Paiement, Commandes,
//          Références, Moyens de paiement, Prépayé, Bons, Fidélité, Contrats
// ============================================================

import { useState, useEffect } from "react";
import * as billingService from "../../../services/billing.service";
import * as agreementsService from "../../../services/agreements.service";
import * as ordersService from "../../../services/orders.service";
import * as servicesService from "../../../services/services.service";
import { getCredentials } from "../../../services/api";
import "./styles.css";

interface BillingPageProps {
  isActive: boolean;
  initialTab?: string;
}

const tabs = [
  { id: "services", label: "Mes services" },
  { id: "invoices", label: "Factures" },
  { id: "refunds", label: "Avoirs" },
  { id: "payments", label: "Paiement" },
  { id: "orders", label: "Commandes" },
  { id: "references", label: "Mes références internes" },
  { id: "methods", label: "Moyens de paiement" },
  { id: "prepaid", label: "Compte prépayé" },
  { id: "vouchers", label: "Bon d'achat" },
  { id: "fidelity", label: "Points de fidélité" },
  { id: "contracts", label: "Contrats" },
];

// Mapping des IDs de navigation vers les IDs de tabs
const tabIdMap: Record<string, string> = {
  "billing-services": "services",
  "billing-invoices": "invoices",
  "billing-refunds": "refunds",
  "billing-payments": "payments",
  "billing-orders": "orders",
  "billing-references": "references",
  "billing-methods": "methods",
  "billing-prepaid": "prepaid",
  "billing-vouchers": "vouchers",
  "billing-fidelity": "fidelity",
  "billing-contracts": "contracts",
};

function useCredentials() {
  const [credentials, setCredentials] = useState<billingService.OvhCredentials | null>(null);
  useEffect(() => { setCredentials(getCredentials()); }, []);
  return credentials;
}

function isNotFoundError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return msg.includes("404") || msg.includes("not found") || msg.includes("does not exist");
  }
  return false;
}

export function BillingPage({ isActive, initialTab = "services" }: BillingPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const credentials = useCredentials();

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.find(t => t.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  if (!isActive) return null;

  if (!credentials) {
    return (
      <div className="billing-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1>Facturation</h1>
            <p className="page-subtitle">Connectez-vous pour accéder à vos factures et moyens de paiement.</p>
          </div>
        </div>
        <div className="billing-content">
          <div className="empty-state">
            <LockIcon />
            <h3>Authentification requise</h3>
            <p>Veuillez vous connecter avec vos identifiants OVH pour accéder à cette section.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>Facturation</h1>
          <p className="page-subtitle">Gérez vos services, factures, paiements et moyens de paiement.</p>
        </div>
        <a href="https://help.ovhcloud.com/csm/fr-billing-faq" target="_blank" rel="noopener noreferrer" className="guides-link">
          <BookIcon /> Guides
        </a>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="billing-content">
        {activeTab === "services" && <ServicesTab credentials={credentials} />}
        {activeTab === "invoices" && <InvoicesTab credentials={credentials} />}
        {activeTab === "refunds" && <RefundsTab credentials={credentials} />}
        {activeTab === "payments" && <PaymentsTab credentials={credentials} />}
        {activeTab === "orders" && <OrdersTab credentials={credentials} />}
        {activeTab === "references" && <ReferencesTab credentials={credentials} />}
        {activeTab === "methods" && <MethodsTab credentials={credentials} />}
        {activeTab === "prepaid" && <PrepaidTab credentials={credentials} />}
        {activeTab === "vouchers" && <VouchersTab credentials={credentials} />}
        {activeTab === "fidelity" && <FidelityTab credentials={credentials} />}
        {activeTab === "contracts" && <ContractsTab credentials={credentials} />}
      </div>
    </div>
  );
}

interface TabProps { credentials: billingService.OvhCredentials; }

// ============================================================
// SERVICES TAB - Liste des services avec renouvellement
// ============================================================
function ServicesTab({ credentials }: TabProps) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "expiring" | "autorenew">("all");

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesService.getBillingServices(credentials);
      const data = Array.isArray(response) ? response : (response?.data || []);
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  
  const filteredServices = services.filter(s => {
    if (filter === "all") return true;
    if (filter === "expiring") {
      const exp = new Date(s.expiration);
      const now = new Date();
      const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 30 && diff > 0;
    }
    if (filter === "autorenew") return s.renew?.automatic === true;
    return true;
  });

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des services...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadServices} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar">
        <div className="toolbar-left">
          <select className="period-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">Tous les services</option>
            <option value="expiring">Expire bientôt</option>
            <option value="autorenew">Renouvellement auto</option>
          </select>
          <span className="result-count">{filteredServices.length} service(s)</span>
        </div>
      </div>
      {filteredServices.length === 0 ? (
        <div className="empty-state"><ServerIcon /><h3>Aucun service</h3><p>Vous n'avez pas de service correspondant aux critères.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Service</th><th>Type</th><th>Expiration</th><th>Renouvellement</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredServices.map((s: any) => (
                <tr key={s.serviceId}>
                  <td className="service-name">{s.resource?.displayName || s.resource?.name || s.serviceId}</td>
                  <td>{s.resource?.product?.name || s.route?.path || "-"}</td>
                  <td>{s.expiration ? formatDate(s.expiration) : "-"}</td>
                  <td>
                    {s.renew?.automatic ? (
                      <span className="status-badge badge-success">Auto</span>
                    ) : (
                      <span className="status-badge badge-warning">Manuel</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm">Gérer</button>
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

// ============================================================
// INVOICES TAB - Factures
// ============================================================
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
  const formatAmount = (v: number, c: string) => {
    if (!c || c.toLowerCase() === "points") return `${v.toLocaleString("fr-FR")} pts`;
    try {
      return new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);
    } catch {
      return `${v.toLocaleString("fr-FR")} ${c}`;
    }
  };
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
      {loading ? (
        <div className="loading-state"><div className="spinner"></div><p>Chargement des factures...</p></div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : bills.length === 0 ? (
        <div className="empty-state"><EmptyIcon /><h3>Aucune facture</h3><p>Vous n'avez pas de facture pour la période sélectionnée.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table bills-table">
            <thead><tr><th>Référence</th><th>Date</th><th>Montant HT</th><th>Montant TTC</th><th>Actions</th></tr></thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.billId}>
                  <td className="ref-cell"><span className="ref-badge">{bill.billId}</span></td>
                  <td>{formatDate(bill.date)}</td>
                  <td className="amount-cell">{formatAmount(bill.priceWithoutTax.value, bill.priceWithoutTax.currencyCode)}</td>
                  <td className="amount-cell">{formatAmount(bill.priceWithTax.value, bill.priceWithTax.currencyCode)}</td>
                  <td className="actions-cell">
                    <a href={bill.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>
                    <a href={bill.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>
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

// ============================================================
// REFUNDS TAB - Avoirs
// ============================================================
function RefundsTab({ credentials }: TabProps) {
  const [refunds, setRefunds] = useState<billingService.Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadRefunds(); }, []);

  const loadRefunds = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getRefunds(credentials);
      setRefunds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatAmount = (v: number, c: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{refunds.length} avoir(s)</span></div>
      {refunds.length === 0 ? (
        <div className="empty-state"><EmptyIcon /><h3>Aucun avoir</h3><p>Vous n'avez pas d'avoir sur votre compte.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Référence</th><th>Date</th><th>Montant HT</th><th>Montant TTC</th><th>Actions</th></tr></thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.refundId}>
                  <td className="ref-cell"><span className="ref-badge">{r.refundId}</span></td>
                  <td>{formatDate(r.date)}</td>
                  <td className="amount-cell amount-positive">{formatAmount(r.priceWithoutTax.value, r.priceWithoutTax.currencyCode)}</td>
                  <td className="amount-cell amount-positive">{formatAmount(r.priceWithTax.value, r.priceWithTax.currencyCode)}</td>
                  <td className="actions-cell">
                    {r.pdfUrl && <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>}
                    {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>}
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

// ============================================================
// PAYMENTS TAB - Suivi des paiements
// ============================================================
function PaymentsTab({ credentials }: TabProps) {
  const [deposits, setDeposits] = useState<billingService.Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDeposits(); }, []);

  const loadDeposits = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - 12);
      const data = await billingService.getDeposits(credentials, { "date.from": dateFrom.toISOString().split("T")[0] });
      setDeposits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatAmount = (v: number, c: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{deposits.length} paiement(s) sur les 12 derniers mois</span></div>
      {deposits.length === 0 ? (
        <div className="empty-state"><CheckIcon /><h3>Aucun paiement</h3><p>Aucun paiement enregistré sur cette période.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Référence</th><th>Date</th><th>Montant</th><th>Moyen</th><th>Actions</th></tr></thead>
            <tbody>
              {deposits.map((d) => (
                <tr key={d.depositId}>
                  <td className="ref-cell"><span className="ref-badge">{d.depositId}</span></td>
                  <td>{formatDate(d.date)}</td>
                  <td className="amount-cell">{formatAmount(d.amount.value, d.amount.currencyCode)}</td>
                  <td>{d.paymentInfo?.paymentType || "-"}</td>
                  <td className="actions-cell">
                    {d.pdfUrl && <a href={d.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>}
                    {d.url && <a href={d.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>}
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

// ============================================================
// ORDERS TAB - Commandes
// ============================================================
function OrdersTab({ credentials }: TabProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getOrders(credentials);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatAmount = (v: number, c: string) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: c }).format(v);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <span className="status-badge badge-success">Livrée</span>;
      case "delivering": return <span className="status-badge badge-info">En cours</span>;
      case "checking": return <span className="status-badge badge-warning">Vérification</span>;
      case "cancelled": return <span className="status-badge badge-error">Annulée</span>;
      default: return <span className="status-badge">{status || "-"}</span>;
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{orders.length} commande(s)</span></div>
      {orders.length === 0 ? (
        <div className="empty-state"><CartIcon /><h3>Aucune commande</h3><p>Vous n'avez pas de commande récente.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>N° Commande</th><th>Date</th><th>Montant</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.orderId}>
                  <td className="ref-cell"><span className="ref-badge">{o.orderId}</span></td>
                  <td>{formatDate(o.date)}</td>
                  <td className="amount-cell">{o.priceWithTax ? formatAmount(o.priceWithTax.value, o.priceWithTax.currencyCode) : "-"}</td>
                  <td>{getStatusBadge(o.retractionDate ? "delivered" : "checking")}</td>
                  <td className="actions-cell">
                    {o.pdfUrl && <a href={o.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>}
                    {o.url && <a href={o.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Voir en ligne"><ExternalIcon /></a>}
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

// ============================================================
// REFERENCES TAB - Références internes (PO numbers)
// ============================================================
function ReferencesTab({ credentials }: TabProps) {
  const [references, setReferences] = useState<billingService.PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRef, setEditingRef] = useState<billingService.PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({ reference: "", startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadReferences(); }, []);

  const loadReferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getPurchaseOrders();
      setReferences(data);
    } catch (err) {
      if (isNotFoundError(err)) {
        setReferences([]);
      } else {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const formatDateInput = (d: string) => d ? new Date(d).toISOString().split("T")[0] : "";

  // Calcul du statut dynamique basé sur les dates
  const getDisplayStatus = (ref: billingService.PurchaseOrder): "actif" | "inactif" | "desactivate" => {
    if (!ref.active) return "desactivate";
    const now = new Date();
    const start = new Date(ref.startDate);
    const end = ref.endDate ? new Date(ref.endDate) : null;
    if (end) {
      if (now >= start && now < end) return "actif";
      return "inactif";
    }
    if (now >= start) return "actif";
    return "inactif";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif": return <span className="status-badge badge-success">Actif</span>;
      case "inactif": return <span className="status-badge badge-warning">Inactif</span>;
      case "desactivate": return <span className="status-badge badge-error">Désactivé</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const openCreateForm = () => {
    setEditingRef(null);
    setFormData({ reference: "", startDate: new Date().toISOString().split("T")[0], endDate: "" });
    setShowForm(true);
  };

  const openEditForm = (ref: billingService.PurchaseOrder) => {
    setEditingRef(ref);
    setFormData({
      reference: ref.reference,
      startDate: formatDateInput(ref.startDate),
      endDate: ref.endDate ? formatDateInput(ref.endDate) : ""
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingRef) {
        await billingService.updatePurchaseOrder(editingRef.id, {
          reference: formData.reference,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined
        });
      } else {
        await billingService.createPurchaseOrder({
          reference: formData.reference,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined
        });
      }
      setShowForm(false);
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (ref: billingService.PurchaseOrder) => {
    try {
      await billingService.updatePurchaseOrder(ref.id, { active: !ref.active });
      await loadReferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du changement de statut");
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des références...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadReferences} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  return (
    <div className="tab-panel">
      <div className="section-description" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--color-background-subtle)", borderRadius: "8px" }}>
        <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
          Votre référence interne correspond à une purchase order (PO), un nom de projet ou une mention interne. 
          Toutes les factures émises indiqueront cette référence.
        </p>
      </div>

      {showForm && (
        <div className="form-card" style={{ marginBottom: "1.5rem", padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "8px", background: "var(--color-background)" }}>
          <h4 style={{ marginBottom: "1rem" }}>{editingRef ? "Modifier la référence" : "Créer une référence interne"}</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Référence *</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} required className="form-input" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }} placeholder="Ex: PO-2024-001" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Date de début *</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required className="form-input" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }} />
              </div>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>Date de fin <span style={{ fontWeight: 400, color: "var(--color-text-tertiary)" }}>(optionnel, exclue)</span></label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="form-input" style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--color-border)" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Annuler</button>
              <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? "Enregistrement..." : (editingRef ? "Modifier" : "Créer")}</button>
            </div>
          </form>
        </div>
      )}

      <div className="toolbar">
        <span className="result-count">{references.length} référence(s)</span>
        {!showForm && <button className="btn btn-primary btn-sm" onClick={openCreateForm}>{references.length > 0 ? "Ajouter une référence" : "Créer une référence interne"}</button>}
      </div>

      {references.length === 0 ? (
        <div className="empty-state">
          <TagIcon />
          <h3>Aucune référence interne</h3>
          <p>Les références internes (numéro de bon de commande, PO) vous permettent d'identifier vos factures plus facilement.</p>
          {!showForm && <button className="btn btn-primary" onClick={openCreateForm}>Créer une référence interne</button>}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Référence</th><th>Date de création</th><th>Date de début</th><th>Date de fin</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {references.map((r) => {
                const displayStatus = getDisplayStatus(r);
                return (
                  <tr key={r.id}>
                    <td><span className="ref-badge" style={{ fontWeight: 600 }}>{r.reference}</span></td>
                    <td>{formatDate(r.creationDate)}</td>
                    <td>{formatDate(r.startDate)}</td>
                    <td>{r.endDate ? formatDate(r.endDate) : "-"}</td>
                    <td>{getStatusBadge(displayStatus)}</td>
                    <td className="actions-cell">
                      <button className="action-btn" title="Modifier" onClick={() => openEditForm(r)}><EditIcon /></button>
                      <button className="action-btn" title={r.active ? "Désactiver" : "Réactiver"} onClick={() => toggleStatus(r)}>{r.active ? <PauseIcon /> : <PlayIcon />}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============================================================
// METHODS TAB - Moyens de paiement
// ============================================================
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

  const getStatusBadge = (status: string, isDefault: boolean) => {
    if (isDefault) return <span className="status-badge badge-primary">Par défaut</span>;
    switch (status) {
      case "VALID": return <span className="status-badge badge-success">Actif</span>;
      case "EXPIRED": return <span className="status-badge badge-error">Expiré</span>;
      case "PENDING": return <span className="status-badge badge-warning">En attente</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

   const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : null;
 
   const getPaymentIcon = (type: string, subType?: string) => {
     const t = (subType || type || "").toLowerCase();
     if (t.includes("visa")) return <VisaIcon />;
     if (t.includes("mastercard") || t.includes("mc")) return <MastercardIcon />;
     if (t.includes("amex") || t.includes("american")) return <AmexIcon />;
     if (t.includes("sepa") || t.includes("bank") || t.includes("prelevement")) return <BankIcon />;
     if (t.includes("paypal")) return <PaypalIcon />;
     return <CardIcon />;
   };
 
   const getPaymentTypeName = (type: string, subType?: string) => {
     const t = (subType || type || "").toLowerCase();
     if (t.includes("visa")) return "Visa";
     if (t.includes("mastercard") || t.includes("mc")) return "Mastercard";
     if (t.includes("amex") || t.includes("american")) return "American Express";
     if (t.includes("sepa") || t.includes("prelevement")) return "Prélèvement SEPA";
     if (t.includes("bank")) return "Virement bancaire";
     if (t.includes("paypal")) return "PayPal";
     if (t.includes("credit") || t.includes("card")) return "Carte bancaire";
     return type || "Autre";
   };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
   if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadMethods} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  return (
    <div className="tab-panel">
       <div className="section-description" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--color-background-subtle, #f8f9fa)", borderRadius: "8px" }}>
         <p style={{ margin: 0, color: "var(--color-text-secondary, #6c757d)" }}>
           Gérez vos moyens de paiement pour le règlement automatique de vos factures OVHcloud.
         </p>
       </div>
 
      <div className="toolbar">
        <span className="result-count">{methods.length} moyen(s) de paiement</span>
        <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Ajouter un moyen de paiement</a>
      </div>
      {methods.length === 0 ? (
         <div className="empty-state">
           <CardIcon />
           <h3>Aucun moyen de paiement</h3>
           <p>Ajoutez un moyen de paiement pour régler automatiquement vos factures.</p>
           <a href="https://www.ovh.com/manager/#/dedicated/billing/payment/method/add" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: "1rem" }}>Ajouter un moyen de paiement</a>
         </div>
      ) : (
        <div className="methods-grid">
          {methods.map((m) => (
            <div key={m.paymentMethodId} className={`method-card ${m.default ? "default" : ""}`}>
               <div className="method-icon-wrapper">
                 {getPaymentIcon(m.paymentType, m.paymentSubType)}
              </div>
               <div className="method-content">
                 <div className="method-header">
                   <h4 className="method-name">{getPaymentTypeName(m.paymentType, m.paymentSubType)}</h4>
                   <div className="method-badges">
                     {m.default && <span className="status-badge badge-primary">Par défaut</span>}
                     {getStatusBadge(m.status, false)}
                   </div>
                 </div>
                 <div className="method-details">
                   {m.label && <p className="method-label">{m.label}</p>}
                   {m.description && <p className="method-description">{m.description}</p>}
                 </div>
                 <div className="method-meta">
                   {m.expirationDate && formatDate(m.expirationDate) && (
                     <span className="method-expiry">
                       {new Date(m.expirationDate) < new Date() ? "Expiré" : "Expire"} : {formatDate(m.expirationDate)}
                     </span>
                   )}
                   {m.creationDate && (
                     <span className="method-created">Ajouté le {new Date(m.creationDate).toLocaleDateString("fr-FR")}</span>
                   )}
                 </div>
               </div>
               <div className="method-actions">
                 <a 
                   href={`https://www.ovh.com/manager/#/dedicated/billing/payment/method/${m.paymentMethodId}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="action-btn"
                   title="Gérer"
                 >
                   <ExternalIcon />
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PREPAID TAB - Compte prépayé
// ============================================================
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
      const acc = await billingService.getOvhAccount(credentials);
      setAccount(acc);
      const mvts = await billingService.getOvhAccountMovements(credentials);
      setMovements(mvts);
    } catch (err) {
      if (isNotFoundError(err)) { setNotAvailable(true); }
      else { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  if (notAvailable) return <div className="tab-panel"><div className="empty-state"><WalletIcon /><h3>Compte prépayé non disponible</h3><p>Le compte prépayé n'est pas activé pour votre compte OVH.</p></div></div>;

  return (
    <div className="tab-panel">
      <div className="prepaid-card">
        <h3>Solde du compte prépayé</h3>
        <div className="prepaid-amount">{account?.balance.text || "0,00 EUR"}</div>
        {account?.alertThreshold !== undefined && <p className="prepaid-threshold">Seuil d'alerte : {account.alertThreshold} {account.balance.currencyCode}</p>}
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

// ============================================================
// VOUCHERS TAB - Bons d'achat
// ============================================================
function VouchersTab({ credentials }: TabProps) {
  const [vouchers, setVouchers] = useState<billingService.VoucherAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadVouchers(); }, []);

  const loadVouchers = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const data = await billingService.getVoucherAccounts(credentials);
      setVouchers(data);
    } catch (err) {
      if (isNotFoundError(err)) { setNotAvailable(true); }
      else { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      {notAvailable || vouchers.length === 0 ? (
        <div className="empty-state"><GiftIcon /><h3>Aucun bon d'achat</h3><p>Vous n'avez pas de bon d'achat actif sur votre compte.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Code</th><th>Solde</th><th>Date d'ouverture</th><th>Dernière mise à jour</th></tr></thead>
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

// ============================================================
// FIDELITY TAB - Points de fidélité
// ============================================================
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
      if (isNotFoundError(err)) { setNotAvailable(true); }
      else { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  if (notAvailable) return <div className="tab-panel"><div className="empty-state"><StarIcon /><h3>Programme de fidélité non disponible</h3><p>Le programme de fidélité n'est pas activé pour votre compte OVH.</p></div></div>;

  return (
    <div className="tab-panel">
      <div className="points-card">
        <h3>Mes points de fidélité</h3>
        <div className="points-amount">{account?.balance || 0} points</div>
        <p className="points-info">Cumulez des points à chaque commande et convertissez-les en réduction sur vos prochains achats.</p>
        {account?.canBeCredited && <a href="https://www.ovh.com/fr/order/express/#/express/review?products=~(~(planCode~'fidelity~quantity~1))" target="_blank" rel="noopener noreferrer" className="btn btn-white">Utiliser mes points</a>}
      </div>
      <h4>Historique des points</h4>
      {movements.length === 0 ? (
        <div className="empty-state small"><p>Aucun historique de points</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Opération</th><th>Crédit</th><th>Débit</th><th>Solde</th></tr></thead>
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

// ============================================================
// CONTRACTS TAB - Contrats
// ============================================================
function ContractsTab({ credentials }: TabProps) {
  const [agreements, setAgreements] = useState<agreementsService.AgreementDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  useEffect(() => { loadAgreements(); }, []);

  const loadAgreements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agreementsService.getAllAgreements(credentials);
      setAgreements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    setAcceptingId(id);
    try {
      await agreementsService.acceptAgreement(credentials, id);
      await loadAgreements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'acceptation");
    } finally {
      setAcceptingId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const getStatusBadge = (agreed: string) => {
    switch (agreed) {
      case "ok": return <span className="status-badge badge-success">Accepté</span>;
      case "todo": return <span className="status-badge badge-warning">À signer</span>;
      case "ko": return <span className="status-badge badge-error">Refusé</span>;
      default: return <span className="status-badge">{agreed}</span>;
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des contrats...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadAgreements} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  const pendingAgreements = agreements.filter(a => a.agreed === "todo");
  const acceptedAgreements = agreements.filter(a => a.agreed === "ok");

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{agreements.length} contrat(s)</span></div>
      {pendingAgreements.length > 0 && (
        <div className="agreements-section">
          <h4 className="section-title"><span className="warning-icon">⚠</span> Contrats en attente de signature ({pendingAgreements.length})</h4>
          <div className="agreements-list">
            {pendingAgreements.map((a) => (
              <div key={a.id} className="agreement-card pending">
                <div className="agreement-info">
                  <h5 className="agreement-name">{a.contract?.name || `Contrat #${a.contractId}`}</h5>
                  <p className="agreement-date">Date : {formatDate(a.date)}</p>
                  {getStatusBadge(a.agreed)}
                </div>
                <div className="agreement-actions">
                  {a.contract?.pdf && <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><DownloadIcon /> PDF</a>}
                  <button className="btn btn-primary btn-sm" onClick={() => handleAccept(a.id)} disabled={acceptingId === a.id}>{acceptingId === a.id ? "Acceptation..." : "Accepter"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {acceptedAgreements.length > 0 && (
        <div className="agreements-section">
          <h4 className="section-title">Contrats acceptés ({acceptedAgreements.length})</h4>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Contrat</th><th>Date d'acceptation</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {acceptedAgreements.map((a) => (
                  <tr key={a.id}>
                    <td><span className="agreement-name-cell">{a.contract?.name || `Contrat #${a.contractId}`}</span></td>
                    <td>{formatDate(a.date)}</td>
                    <td>{getStatusBadge(a.agreed)}</td>
                    <td className="actions-cell">{a.contract?.pdf && <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {agreements.length === 0 && <div className="empty-state"><ContractIcon /><h3>Aucun contrat</h3><p>Vous n'avez pas de contrat associé à votre compte.</p></div>}
    </div>
  );
}

// ============================================================
// ICONS
// ============================================================
function DownloadIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>; }
function ExternalIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>; }
function EditIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>; }
function PauseIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>; }
function PlayIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>; }
function EmptyIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>; }
function CheckIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function CardIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>; }
function GiftIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18a1.5 1.5 0 001.5-1.5v-1.5a1.5 1.5 0 00-1.5-1.5h-18a1.5 1.5 0 00-1.5 1.5v1.5a1.5 1.5 0 001.5 1.5z" /></svg>; }
function LockIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>; }
function WalletIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>; }
function StarIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>; }
function ContractIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 3h6m-6 3h3" /></svg>; }
function ServerIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" /></svg>; }
function CartIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>; }
function TagIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-icon"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>; }
function BookIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>; }
function VisaIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102h2.037zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.823-.628a3.66 3.66 0 011.91.336l.34-1.59a5.207 5.207 0 00-1.814-.332c-1.917 0-3.266 1.02-3.278 2.479-.013 1.08.963 1.683 1.7 2.042.756.368 1.01.604 1.006.933-.005.504-.603.726-1.16.735-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.57zm5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488l.233 1.12zm-2.166-2.656l1.02-2.815.588 2.815h-1.608zm-8.151-4.84l-1.603 7.496H8.34l1.605-7.496h1.944z"/></svg>; }
function MastercardIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><circle cx="9" cy="12" r="7" fillOpacity="0.8"/><circle cx="15" cy="12" r="7" fillOpacity="0.6"/></svg>; }
function AmexIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><rect x="2" y="5" width="20" height="14" rx="2" fillOpacity="0.8"/><text x="12" y="14" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">AMEX</text></svg>; }
function BankIcon() { return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>; }
function PaypalIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.771.771 0 01.762-.654h6.417c2.136 0 3.848.562 4.993 1.64 1.19 1.12 1.57 2.673 1.14 4.627-.49 2.226-1.537 3.897-3.117 4.967-1.55 1.05-3.534 1.582-5.899 1.582H7.573a.77.77 0 00-.761.654l-.736 4.8z"/></svg>; }

export default BillingPage;
