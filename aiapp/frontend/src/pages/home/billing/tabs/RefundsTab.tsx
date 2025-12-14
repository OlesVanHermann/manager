import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, formatAmount } from "../utils";
import { DownloadIcon, ExternalIcon, EmptyIcon } from "../icons";

export function RefundsTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
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
      setError(err instanceof Error ? err.message : t('errors.loadError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{t('refunds.count', { count: refunds.length })}</span></div>
      {refunds.length === 0 ? (
        <div className="empty-state"><EmptyIcon /><h3>{t('refunds.empty.title')}</h3><p>{t('refunds.empty.description')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>{t('columns.reference')}</th><th>{t('columns.date')}</th><th>{t('columns.amountHT')}</th><th>{t('columns.amountTTC')}</th><th>{t('columns.actions')}</th></tr></thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.refundId}>
                  <td className="ref-cell"><span className="ref-badge">{r.refundId}</span></td>
                  <td>{formatDate(r.date)}</td>
                  <td className="amount-cell amount-positive">{formatAmount(r.priceWithoutTax.value, r.priceWithoutTax.currencyCode)}</td>
                  <td className="amount-cell amount-positive">{formatAmount(r.priceWithTax.value, r.priceWithTax.currencyCode)}</td>
                  <td className="actions-cell">
                    {r.pdfUrl && <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>}
                    {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.viewOnline')}><ExternalIcon /></a>}
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
