import { useState, useEffect } from "react";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, isNotFoundError } from "../utils";
import { GiftIcon } from "../icons";

export function VouchersTab({ credentials }: TabProps) {
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
      else { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;

  return (
    <div className="tab-panel">
      {notAvailable || vouchers.length === 0 ? (
        <div className="empty-state"><GiftIcon /><h3>Aucun bon d'achat</h3><p>Vous n'avez pas de bon d'achat actif sur votre compte.</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Code</th><th>Solde</th><th>Date d'ouverture</th><th>Dernière mise à jour</th></tr></thead>
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
