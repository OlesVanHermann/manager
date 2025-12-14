import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import type { OvhCredentials } from "../../../../types/auth.types";

const STORAGE_KEY = "ovh_credentials";

interface LastBillTileProps {
  onViewBill?: () => void;
}

export default function LastBillTile({ onViewBill }: LastBillTileProps) {
  const { t } = useTranslation('home/account/index');
  const { t: tCommon } = useTranslation('common');
  const [bill, setBill] = useState<billingService.Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLastBill();
  }, []);

  const getCredentials = (): OvhCredentials | null => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const loadLastBill = async () => {
    const credentials = getCredentials();
    if (!credentials) {
      setError(t('lastBill.errors.notAuthenticated'));
      setLoading(false);
      return;
    }

    try {
      const bills = await billingService.getBills(credentials, { limit: 1 });
      if (bills.length > 0) {
        setBill(bills[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('error.generic'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="tile">
      <h2 className="tile-header">{t('lastBill.title')}</h2>
      <div className="tile-content">
        {loading ? (
          <div className="skeleton-loader">{tCommon('loading')}</div>
        ) : error ? (
          <div className="error-text">{error}</div>
        ) : bill ? (
          <>
            <dl className="bill-details">
              <dt>{t('lastBill.reference')}</dt>
              <dd>{bill.billId}</dd>
              <dt>{t('lastBill.date')}</dt>
              <dd>{formatDate(bill.date)}</dd>
              <dt>{t('lastBill.amount')}</dt>
              <dd className="bill-amount">{bill.priceWithTax.text}</dd>
            </dl>
            
            <div className="tile-footer">
              <a 
                href={bill.pdfUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                {t('lastBill.viewBill')}
              </a>
            </div>
          </>
        ) : (
          <div className="empty-text">{t('lastBill.empty')}</div>
        )}
        
        {!loading && (
          <div className="tile-footer" style={{ marginTop: "0.5rem" }}>
            <button onClick={onViewBill} className="btn btn-link">
              {t('lastBill.viewAllBills')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
