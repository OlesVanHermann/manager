import { useState } from "react";
import "./styles.css";

const tabs = [
  { id: "orders", label: "Mes commandes" },
  { id: "purchaseOrders", label: "Mes références internes" },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Mes commandes</h1>
        <p className="page-description">Consultez votre historique et suivez les commandes en cours. Accédez à vos bons de commande.</p>
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
  return (
    <div className="orders-tab">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Numéro de commande</th>
            <th>État</th>
            <th>Montant avec taxes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucune commande</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PurchaseOrdersTab() {
  return (
    <div className="purchase-orders-tab">
      <div className="info-box">
        <h3>Références internes (Purchase Orders)</h3>
        <p>Associez vos propres numéros de commande aux commandes OVHcloud pour faciliter votre suivi comptable.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="empty-cell">Aucune référence interne</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
