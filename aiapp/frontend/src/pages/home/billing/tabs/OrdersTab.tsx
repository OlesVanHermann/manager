import { useState, useEffect } from "react";
import * as ordersService from "../../../../services/orders.service";
import { TabProps, formatDate, formatAmount } from "../utils";
import { DownloadIcon, ExternalIcon, CartIcon } from "../icons";

export function OrdersTab({ credentials }: TabProps) {
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
