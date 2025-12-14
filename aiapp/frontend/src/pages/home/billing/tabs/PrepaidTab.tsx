import { useState, useEffect } from "react";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, isNotFoundError } from "../utils";
import { WalletIcon } from "../icons";

export function PrepaidTab({ credentials }: TabProps) {
  const [account, setAccount] = useState<billingService.OvhAccount | null>(null);
  const [movements, setMovements] = useState<billingService.OvhAccountMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAvailable, setNotAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadPrepaid(); }, []);

  const loadPrepaid = async () => {
    setLoading(true);
    setError(null);
    setNotAvailable(false);
    try {
      const acc = await billingService.getOvhAccount(credentials);
      setAccount(acc);
      const mvts = await billingService.getOvhAccountMovements(credentials);
      setMovements(mvts);
    } catch (err) {
      if (isNotFoundError(err)) { setNotAvailable(true); }
      else { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  if (notAvailable) return <div className="tab-panel"><div className="empty-state"><WalletIcon /><h3>Compte prépayé non disponible</h3><p>Le compte prépayé n'est pas activé pour votre compte OVH.</p></div></div>;

  return (
    <div className="tab-panel">
      <div className="prepaid-card">
        <h3>Solde du compte prépayé</h3>
        <div className="prepaid-amount">{account?.balance.text || "0,00 EUR"}</div>
        {account?.alertThreshold !== undefined && <p className="prepaid-threshold">Seuil d'alerte : {account.alertThreshold} {account.balance.currencyCode}</p>}
      </div>
      <h4>Historique des mouvements</h4>
      {movements.length === 0 ? (
        <div className="empty-state small"><p>Aucun mouvement</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Description</th><th>Montant</th><th>Solde</th></tr></thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.movementId}>
                  <td>{formatDate(m.date)}</td>
                  <td>{m.description}</td>
                  <td className={m.amount.value >= 0 ? "amount-positive" : "amount-negative"}>{m.amount.text}</td>
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
