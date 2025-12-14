import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as ordersService from "../../../../services/orders.service";
import { TabProps, formatDate, formatAmount } from "../utils";
import { DownloadIcon, ExternalIcon, CartIcon } from "../icons";

export function OrdersTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
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
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <span className="status-badge badge-success">{t('orders.status.delivered')}</span>;
      case "delivering": return <span className="status-badge badge-info">{t('orders.status.delivering')}</span>;
      case "checking": return <span className="status-badge badge-warning">{t('orders.status.checking')}</span>;
      case "cancelled": return <span className="status-badge badge-error">{t('orders.status.cancelled')}</span>;
      default: return <span className="status-badge">{status || "-"}</span>;
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{t('orders.count', { count: orders.length })}</span></div>
      {orders.length === 0 ? (
        <div className="empty-state"><CartIcon /><h3>{t('orders.empty.title')}</h3><p>{t('orders.empty.description')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>{t('columns.orderId')}</th><th>{t('columns.date')}</th><th>{t('columns.amount')}</th><th>{t('columns.status')}</th><th>{t('columns.actions')}</th></tr></thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.orderId}>
                  <td className="ref-cell"><span className="ref-badge">{o.orderId}</span></td>
                  <td>{formatDate(o.date)}</td>
                  <td className="amount-cell">{o.priceWithTax ? formatAmount(o.priceWithTax.value, o.priceWithTax.currencyCode) : "-"}</td>
                  <td>{getStatusBadge(o.retractionDate ? "delivered" : "checking")}</td>
                  <td className="actions-cell">
                    {o.pdfUrl && <a href={o.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>}
                    {o.url && <a href={o.url} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a>}
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
