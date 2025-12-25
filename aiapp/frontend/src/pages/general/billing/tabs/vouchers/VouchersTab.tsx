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
      <div className="vouchers-panel">
        <div className="vouchers-loading-state">
          <div className="vouchers-spinner"></div>
          <p>{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vouchers-panel">
        <div className="vouchers-error-banner">{error}</div>
      </div>
    );
  }

  return (
    <div className="vouchers-panel">
      {notAvailable || vouchers.length === 0 ? (
        <div className="vouchers-empty-state">
          <GiftIcon />
          <h3>{t("vouchers.empty.title")}</h3>
          <p>{t("vouchers.empty.description")}</p>
        </div>
      ) : (
        <div className="vouchers-table-container">
          <table className="vouchers-table">
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
                  <td className="vouchers-ref-cell"><span className="vouchers-ref-badge">{v.voucherAccount}</span></td>
                  <td className="vouchers-amount-cell">{v.balance.text}</td>
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
