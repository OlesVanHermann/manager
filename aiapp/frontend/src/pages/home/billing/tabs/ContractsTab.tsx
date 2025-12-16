import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as agreementsService from "../../../../services/home.billing.agreements";
import { TabProps, formatDateLong } from "../utils";
import { DownloadIcon, ContractIcon } from "../icons";

export function ContractsTab({ credentials }: TabProps) {
  const { t } = useTranslation('home/billing/tabs');
  const { t: tCommon } = useTranslation('common');
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
      setError(err instanceof Error ? err.message : t('errors.loadError'));
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
      setError(err instanceof Error ? err.message : t('contracts.errors.acceptError'));
    } finally {
      setAcceptingId(null);
    }
  };

  const getStatusBadge = (agreed: string) => {
    switch (agreed) {
      case "ok": return <span className="status-badge badge-success">{t('contracts.status.accepted')}</span>;
      case "todo": return <span className="status-badge badge-warning">{t('contracts.status.toSign')}</span>;
      case "ko": return <span className="status-badge badge-error">{t('contracts.status.refused')}</span>;
      default: return <span className="status-badge">{agreed}</span>;
    }
  };

  if (loading) return <div className="tab-panel"><div className="loading-state"><div className="spinner"></div><p>{t('contracts.loading')}</p></div></div>;
  if (error) return <div className="tab-panel"><div className="error-banner">{error}<button onClick={loadAgreements} className="btn btn-sm btn-secondary" style={{ marginLeft: "1rem" }}>{tCommon('actions.refresh')}</button></div></div>;

  const pendingAgreements = agreements.filter(a => a.agreed === "todo");
  const acceptedAgreements = agreements.filter(a => a.agreed === "ok");

  return (
    <div className="tab-panel">
      <div className="toolbar"><span className="result-count">{t('contracts.count', { count: agreements.length })}</span></div>
      {pendingAgreements.length > 0 && (
        <div className="agreements-section">
          <h4 className="section-title"><span className="warning-icon">⚠</span> {t('contracts.pendingSection', { count: pendingAgreements.length })}</h4>
          <div className="agreements-list">
            {pendingAgreements.map((a) => (
              <div key={a.id} className="agreement-card pending">
                <div className="agreement-info">
                  <h5 className="agreement-name">{a.contract?.name || `${t('contracts.contractNumber')} #${a.contractId}`}</h5>
                  <p className="agreement-date">{t('columns.date')} : {formatDateLong(a.date)}</p>
                  {getStatusBadge(a.agreed)}
                </div>
                <div className="agreement-actions">
                  {a.contract?.pdf && <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><DownloadIcon /> PDF</a>}
                  <button className="btn btn-primary btn-sm" onClick={() => handleAccept(a.id)} disabled={acceptingId === a.id}>{acceptingId === a.id ? t('contracts.accepting') : t('contracts.accept')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {acceptedAgreements.length > 0 && (
        <div className="agreements-section">
          <h4 className="section-title">{t('contracts.acceptedSection', { count: acceptedAgreements.length })}</h4>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>{t('columns.contract')}</th><th>{t('contracts.acceptDate')}</th><th>{t('columns.status')}</th><th>{t('columns.actions')}</th></tr></thead>
              <tbody>
                {acceptedAgreements.map((a) => (
                  <tr key={a.id}>
                    <td><span className="agreement-name-cell">{a.contract?.name || `${t('contracts.contractNumber')} #${a.contractId}`}</span></td>
                    <td>{formatDateLong(a.date)}</td>
                    <td>{getStatusBadge(a.agreed)}</td>
                    <td className="actions-cell">{a.contract?.pdf && <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="action-btn" title={t('actions.downloadPdf')}><DownloadIcon /></a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {agreements.length === 0 && <div className="empty-state"><ContractIcon /><h3>{t('contracts.empty.title')}</h3><p>{t('contracts.empty.description')}</p></div>}
    </div>
  );
}
