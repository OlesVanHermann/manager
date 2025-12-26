// ============================================================
// FIDELITY TAB - Points de fidélité (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as fidelityService from "./FidelityTab.service";
import { formatDate, isNotFoundError } from "./FidelityTab.helpers";
import { StarIcon } from "./FidelityTab.icons";
import type { TabProps } from "../../billing.types";
import "./FidelityTab.css";

export function FidelityTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/fidelity");
  const { t: tCommon } = useTranslation('common');
  const [account, setAccount] = useState<fidelityService.FidelityAccount | null>(null);
  const [movements, setMovements] = useState<fidelityService.FidelityMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadFidelity(); }, []);

  const loadFidelity = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const acc = await fidelityService.getFidelityAccount(credentials);
      setAccount(acc);
      const mvts = await fidelityService.getFidelityMovements(credentials);
      setMovements(mvts);
    } catch (err) {
      if (isNotFoundError(err)) { setNotAvailable(true); }
      else { setError(err instanceof Error ? err.message : t('errors.loadError')); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="billing-fidelity-tab-panel">
        <div className="billing-fidelity-loading-state">
          <div className="billing-fidelity-spinner"></div>
          <p>{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-fidelity-tab-panel">
        <div className="billing-fidelity-error-banner">{error}</div>
      </div>
    );
  }

  if (notAvailable) {
    return (
      <div className="billing-fidelity-tab-panel">
        <div className="billing-fidelity-empty-state">
          <StarIcon />
          <h3>{t('fidelity.notAvailable.title')}</h3>
          <p>{t('fidelity.notAvailable.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-fidelity-tab-panel">
      <div className="billing-fidelity-points-card">
        <h3>{t('fidelity.myPoints')}</h3>
        <div className="billing-fidelity-points-amount">{account?.balance || 0} {t('fidelity.points')}</div>
        <p className="billing-fidelity-points-info">{t('fidelity.info')}</p>
        {account?.canBeCredited && (
          <a 
            href="https://www.ovh.com/fr/order/express/#/express/review?products=~(~(planCode~'fidelity~quantity~1))" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="billing-fidelity-btn fidelity-btn-white"
          >
            {t('fidelity.usePoints')}
          </a>
        )}
      </div>

      <h4>{t('fidelity.history')}</h4>

      {movements.length === 0 ? (
        <div className="billing-fidelity-empty-state fidelity-empty-small">
          <p>{t('fidelity.noHistory')}</p>
        </div>
      ) : (
        <div className="billing-fidelity-table-container">
          <table className="billing-fidelity-data-table">
            <thead>
              <tr>
                <th>{t('columns.date')}</th>
                <th>{t('columns.operation')}</th>
                <th>{t('columns.credit')}</th>
                <th>{t('columns.debit')}</th>
                <th>{t('columns.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.movementId}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.description}</td>
                  <td className="billing-fidelity-amount-positive">
                    {m.previousBalance < m.balance ? `${m.amount} pts` : "-"}
                  </td>
                  <td className="billing-fidelity-amount-negative">
                    {m.previousBalance >= m.balance ? `${Math.abs(m.amount)} pts` : "-"}
                  </td>
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
