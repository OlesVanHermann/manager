import { useState, useEffect } from "react";
import * as agreementsService from "../../../../services/agreements.service";
import { TabProps, formatDateLong } from "../utils";
import { DownloadIcon, ContractIcon } from "../icons";

export function ContractsTab({ credentials }: TabProps) {
  const [agreements, setAgreements] = useState<agreementsService.AgreementDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  useEffect(() => { loadAgreements(); }, []);

  const loadAgreements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agreementsService.getAllAgreements(credentials);
      setAgreements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    setAcceptingId(id);
    try {
      await agreementsService.acceptAgreement(credentials, id);
      await loadAgreements();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'acceptation");
    } finally {
      setAcceptingId(null);
    }
  };

  const getStatusBadge = (agreed: string) => {
    switch (agreed) {
      case "ok": return <span className="status-badge badge-success">Accepté</span>;
      case "todo": return <span className="status-badge badge-warning">À signer</span>;
      case "ko": return <span className="status-badge badge-error">Refusé</span>;
      default: return <span className="status-badge">{agreed}</span>;
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>Chargement des contrats...</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadAgreements} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>Réessayer</button></div></div>;

  const pendingAgreements = agreements.filter(a => a.agreed === "todo");
  const acceptedAgreements = agreements.filter(a => a.agreed === "ok");

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{agreements.length} contrat(s)</span></div>
      {pendingAgreements.length > 0 && (
        <div className="agreements-section">
          <h4 className="section-title"><span className="warning-icon">⚠</span> Contrats en attente de signature ({pendingAgreements.length})</h4>
          <div className="agreements-list">
            {pendingAgreements.map((a) => (
              <div key={a.id} className="agreement-card pending">
                <div className="agreement-info">
                  <h5 className="agreement-name">{a.contract?.name || `Contrat #${a.contractId}`}</h5>
                  <p className="agreement-date">Date : {formatDateLong(a.date)}</p>
                  {getStatusBadge(a.agreed)}
                </div>
                <div className="agreement-actions">
                  {a.contract?.pdf && <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><DownloadIcon /> PDF</a>}
                  <button className="btn btn-primary btn-sm" onClick={() => handleAccept(a.id)} disabled={acceptingId === a.id}>{acceptingId === a.id ? "Acceptation..." : "Accepter"}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {acceptedAgreements.length > 0 && (
        <div className="agreements-section">
          <h4 className="section-title">Contrats acceptés ({acceptedAgreements.length})</h4>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Contrat</th><th>Date d'acceptation</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {acceptedAgreements.map((a) => (
                  <tr key={a.id}>
                    <td><span className="agreement-name-cell">{a.contract?.name || `Contrat #${a.contractId}`}</span></td>
                    <td>{formatDateLong(a.date)}</td>
                    <td>{getStatusBadge(a.agreed)}</td>
                    <td className="actions-cell">{a.contract?.pdf && <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="action-btn" title="Télécharger PDF"><DownloadIcon /></a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {agreements.length === 0 && <div className="empty-state"><ContractIcon /><h3>Aucun contrat</h3><p>Vous n'avez pas de contrat associé à votre compte.</p></div>}
    </div>
  );
}
