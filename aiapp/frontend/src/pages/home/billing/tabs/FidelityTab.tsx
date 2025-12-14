import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, isNotFoundError } from "../utils";
import { StarIcon } from "../icons";

export function FidelityTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
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
      else { setError(err instanceof Error ? err.message : t('errors.loadError')); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{tCommon('loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  if (notAvailable) return <div className="tab-panel"><div className="empty-state"><StarIcon /><h3>{t('fidelity.notAvailable.title')}</h3><p>{t('fidelity.notAvailable.description')}</p></div></div>;

  return (
    <div className="tab-panel">
      <div className="points-card">
        <h3>{t('fidelity.myPoints')}</h3>
        <div className="points-amount">{account?.balance || 0} {t('fidelity.points')}</div>
        <p className="points-info">{t('fidelity.info')}</p>
        {account?.canBeCredited && <a href="https://www.ovh.com/fr/order/express/#/express/review?products=~(~(planCode~'fidelity~quantity~1))" target="_blank" rel="noopener noreferrer" className="btn btn-white">{t('fidelity.usePoints')}</a>}
      </div>
      <h4>{t('fidelity.history')}</h4>
      {movements.length === 0 ? (
        <div className="empty-state small"><p>{t('fidelity.noHistory')}</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>{t('columns.date')}</th><th>{t('columns.operation')}</th><th>{t('columns.credit')}</th><th>{t('columns.debit')}</th><th>{t('columns.balance')}</th></tr></thead>
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
