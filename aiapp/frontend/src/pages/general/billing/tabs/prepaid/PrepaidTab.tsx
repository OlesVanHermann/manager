// ============================================================
// PREPAID TAB - Compte prépayé OVH (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as prepaidService from "./PrepaidTab.service";
import { formatDate, isNotFoundError } from "./PrepaidTab.helpers";
import { WalletIcon } from "./PrepaidTab.icons";
import type { TabProps } from "../../billing.types";
import "./PrepaidTab.css";

export function PrepaidTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/prepaid");
  const { t: tCommon } = useTranslation('common');
  const [account, setAccount] = useState<prepaidService.OvhAccount | null>(null);
  const [movements, setMovements] = useState<prepaidService.OvhAccountMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPrepaid(); }, []);

  const loadPrepaid = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const acc = await prepaidService.getOvhAccount(credentials);
      setAccount(acc);
      const mvts = await prepaidService.getOvhAccountMovements(credentials);
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
      <div className="billing-prepaid-tab-panel">
        <div className="billing-prepaid-loading-state">
          <div className="billing-prepaid-spinner"></div>
          <p>{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-prepaid-tab-panel">
        <div className="billing-prepaid-error-banner">{error}</div>
      </div>
    );
  }

  if (notAvailable) {
    return (
      <div className="billing-prepaid-tab-panel">
        <div className="billing-prepaid-empty-state">
          <WalletIcon />
          <h3>{t('prepaid.notAvailable.title')}</h3>
          <p>{t('prepaid.notAvailable.description')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-prepaid-tab-panel">
      <div className="billing-prepaid-card">
        <h3>{t('prepaid.balance')}</h3>
        <div className="billing-prepaid-amount">{account?.balance.text || "0,00 EUR"}</div>
        {account?.alertThreshold !== undefined && (
          <p className="billing-prepaid-threshold">
            {t('prepaid.alertThreshold')}: {account.alertThreshold} {account.balance.currencyCode}
          </p>
        )}
      </div>

      <h4>{t('prepaid.movementsHistory')}</h4>

      {movements.length === 0 ? (
        <div className="billing-prepaid-empty-state prepaid-empty-small">
          <p>{t('prepaid.noMovements')}</p>
        </div>
      ) : (
        <div className="billing-prepaid-table-container">
          <table className="billing-prepaid-data-table">
            <thead>
              <tr>
                <th>{t('columns.date')}</th>
                <th>{t('columns.description')}</th>
                <th>{t('columns.amount')}</th>
                <th>{t('columns.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.movementId}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.description}</td>
                  <td className={m.amount.value >= 0 ? "billing-prepaid-amount-positive" : "billing-prepaid-amount-negative"}>
                    {m.amount.text}
                  </td>
                  <td>{m.balance.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
