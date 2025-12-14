import { useState, useEffect } from "react";
import * as billingService from "../../../../services/billing.service";
import { TabProps, formatDate, isNotFoundError } from "../utils";
import { StarIcon } from "../icons";

export function FidelityTab({ credentials }: TabProps) {
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
      else { setError(err instanceof Error ? err.message : "Erreur de chargement"); }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}</div></div>;
  if (notAvailable) return <div className="tab-panel"><div className="empty-state"><StarIcon /><h3>Programme de fidélité non disponible</h3><p>Le programme de fidélité n'est pas activé pour votre compte OVH.</p></div></div>;

  return (
    <div className="tab-panel">
      <div className="points-card">
        <h3>Mes points de fidélité</h3>
        <div className="points-amount">{account?.balance || 0} points</div>
        <p className="points-info">Cumulez des points à chaque commande et convertissez-les en réduction sur vos prochains achats.</p>
        {account?.canBeCredited && <a href="https://www.ovh.com/fr/order/express/#/express/review?products=~(~(planCode~'fidelity~quantity~1))" target="_blank" rel="noopener noreferrer" className="btn btn-white">Utiliser mes points</a>}
      </div>
      <h4>Historique des points</h4>
      {movements.length === 0 ? (
        <div className="empty-state small"><p>Aucun historique de points</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Opération</th><th>Crédit</th><th>Débit</th><th>Solde</th></tr></thead>
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
