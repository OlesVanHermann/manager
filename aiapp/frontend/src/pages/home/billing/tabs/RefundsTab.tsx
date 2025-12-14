import { useState, useEffect } from "react";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, formatAmount } from "../utils";
import { DownloadIcon, ExternalIcon, EmptyIcon } from "../icons";

export function RefundsTab({ credentials }: TabProps) {
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
