import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, isNotFoundError } from "../utils";
import { GiftIcon } from "../icons";

export function VouchersTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
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
      else { setError(err instanceof Error ? err.message : t('errors.loadError')); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      {notAvailable || vouchers.length === 0 ? (
        <div className="empty-state"><GiftIcon /><h3>{t('vouchers.empty.title')}</h3><p>{t('vouchers.empty.description')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>{t('columns.code')}</th><th>{t('columns.balance')}</th><th>{t('columns.openDate')}</th><th>{t('columns.lastUpdate')}</th></tr></thead>
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
