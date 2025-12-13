import { useState, useEffect } from "react";
import type { OvhCredentials } from "../../../types/auth.types";
import * as ordersService from "../../../services/orders.service";
import "./styles.css";

const STORAGE_KEY = "ovh_credentials";

const tabs = [
  { id: "orders", label: "Mes commandes" },
  { id: "purchaseOrders", label: "Mes references internes" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Mes commandes</h1>
        <p className="page-description">Consultez votre historique et suivez les commandes en cours. Accedez a vos bons de commande.</p>
      </div>

      <div className="page-tabs">
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

      <div className="tab-content orders-content">
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "purchaseOrders" && <PurchaseOrdersTab />}
      </div>
    </div>
  );
}

function OrdersTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<ordersService.OrderWithStatus[]>([]);
  const [period, setPeriod] = useState("6");

  useEffect(() => {
    loadOrders();
  }, [period]);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadOrders = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError("Non authentifie");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const months = parseInt(period);
      const dateFrom = new Date();
      dateFrom.setMonth(dateFrom.getMonth() - months);
      const data = await ordersService.getOrders(credentials, { 
        "date.from": dateFrom.toISOString().split("T")[0],
        limit: 100 
      });
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      delivered: { label: "Livre", className: "badge-success" },
      delivering: { label: "En cours", className: "badge-info" },
      checking: { label: "Verification", className: "badge-warning" },
      notPaid: { label: "Non paye", className: "badge-error" },
      cancelled: { label: "Annule", className: "badge-neutral" },
      cancelling: { label: "Annulation", className: "badge-warning" },
      documentsRequested: { label: "Documents requis", className: "badge-warning" },
      unknown: { label: "Inconnu", className: "badge-neutral" },
    };
    return statusMap[status] || { label: status, className: "badge-neutral" };
  };

  if (loading) {
    return (
      <div className="orders-tab">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-tab">
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={loadOrders}>Reessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-tab">
      <div className="toolbar">
        <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="1">1 mois</option>
          <option value="3">3 mois</option>
          <option value="6">6 mois</option>
          <option value="12">12 mois</option>
          <option value="24">24 mois</option>
        </select>
        <span className="result-count">{orders.length} commande(s)</span>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Numero de commande</th>
            <th>Etat</th>
            <th>Montant TTC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-cell">Aucune commande</td>
            </tr>
          ) : (
            orders.map((order) => {
              const status = getStatusBadge(order.status);
              return (
                <tr key={order.orderId}>
                  <td>{formatDate(order.date)}</td>
                  <td>
                    <span className="order-id">{order.orderId}</span>
                  </td>
                  <td>
                    <span className={`badge ${status.className}`}>{status.label}</span>
                  </td>
                  <td className="amount-cell">{order.priceWithTax.text}</td>
                  <td className="actions-cell">
                    <a href={order.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Telecharger PDF">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </a>
                    <a href={order.url} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Voir details">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function PurchaseOrdersTab() {
  return (
    <div className="purchase-orders-tab">
      <div className="info-box">
        <h3>References internes (Purchase Orders)</h3>
        <p>Associez vos propres numeros de commande aux commandes OVHcloud pour faciliter votre suivi comptable.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucune reference interne</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
