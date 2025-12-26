// ============================================================
// VOUCHERS TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vouchersService from "./VouchersTab.service";
import type { TabProps } from "../../billing.types";
import { formatDate, isNotFoundError } from "./VouchersTab.helpers";
import { GiftIcon } from "./VouchersTab.icons";
import "./VouchersTab.css";

export function VouchersTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/vouchers");
  const { t: tCommon } = useTranslation("common");
  const [vouchers, setVouchers] = useState<vouchersService.VoucherAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadVouchers(); }, []);

  const loadVouchers = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const data = await vouchersService.getVoucherAccounts(credentials);
      setVouchers(data);
    } catch (err) {
      if (isNotFoundError(err)) { setNotAvailable(true); }
      else { setError(err instanceof Error ? err.message : t("errors.loadError")); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="billing-vouchers-panel">
        <div className="billing-vouchers-loading-state">
          <div className="billing-vouchers-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-vouchers-panel">
        <div className="billing-vouchers-error-banner">{error}</div>
      </div>
    );
  }

  return (
    <div className="billing-vouchers-panel">
      {notAvailable || vouchers.length === 0 ? (
        <div className="billing-vouchers-empty-state">
          <GiftIcon />
          <h3>{t("vouchers.empty.title")}</h3>
          <p>{t("vouchers.empty.description")}</p>
        </div>
      ) : (
        <div className="billing-vouchers-table-container">
          <table className="billing-vouchers-table">
            <thead>
              <tr>
                <th>{t("columns.code")}</th>
                <th>{t("columns.balance")}</th>
                <th>{t("columns.openDate")}</th>
                <th>{t("columns.lastUpdate")}</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.voucherAccount}>
                  <td className="billing-vouchers-ref-cell"><span className="billing-vouchers-ref-badge">{v.voucherAccount}</span></td>
                  <td className="billing-vouchers-amount-cell">{v.balance.text}</td>
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
