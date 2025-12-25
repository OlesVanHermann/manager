// ============================================================
// CONTRACTS TAB - Composant ISOLÉ (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as contractsService from "./ContractsTab.service";
import type { TabProps } from "../../billing.types";
import { formatDateLong } from "./ContractsTab.helpers";
import { DownloadIcon, ContractIcon } from "./ContractsTab.icons";
import "./ContractsTab.css";

export function ContractsTab({ credentials }: TabProps) {
  const { t } = useTranslation("general/billing/contracts");
  const { t: tCommon } = useTranslation("common");
  const [agreements, setAgreements] = useState<contractsService.AgreementDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  useEffect(() => { loadAgreements(); }, []);

  const loadAgreements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contractsService.getAllAgreements(credentials);
      setAgreements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    setAcceptingId(id);
    try {
      await contractsService.acceptAgreement(credentials, id);
      await loadAgreements();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("contracts.errors.acceptError"));
    } finally {
      setAcceptingId(null);
    }
  };

  const getStatusBadge = (agreed: string) => {
    switch (agreed) {
      case "ok": return <span className="contracts-badge contracts-badge-success">{t("contracts.status.accepted")}</span>;
      case "todo": return <span className="contracts-badge contracts-badge-warning">{t("contracts.status.toSign")}</span>;
      case "ko": return <span className="contracts-badge contracts-badge-error">{t("contracts.status.refused")}</span>;
      default: return <span className="contracts-badge">{agreed}</span>;
    }
  };

  if (loading) {
    return (
      <div className="contracts-panel">
        <div className="contracts-loading-state">
          <div className="contracts-spinner"></div>
          <p>{t("contracts.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contracts-panel">
        <div className="contracts-error-banner">
          {error}
          <button onClick={loadAgreements} className="contracts-btn contracts-btn-secondary contracts-btn-sm" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  const pendingAgreements = agreements.filter(a => a.agreed === "todo");
  const acceptedAgreements = agreements.filter(a => a.agreed === "ok");

  return (
    <div className="contracts-panel">
      <div className="contracts-toolbar">
        <span className="contracts-result-count">{t("contracts.count", { count: agreements.length })}</span>
      </div>

      {pendingAgreements.length > 0 && (
        <div className="contracts-section">
          <h4 className="contracts-section-title">
            <span className="contracts-warning-icon">⚠</span>
            {t("contracts.pendingSection", { count: pendingAgreements.length })}
          </h4>
          <div className="contracts-list">
            {pendingAgreements.map((a) => (
              <div key={a.id} className="contracts-card contracts-pending">
                <div className="contracts-info">
                  <h5 className="contracts-name">{a.contract?.name || `${t("contracts.contractNumber")} #${a.contractId}`}</h5>
                  <p className="contracts-date">{t("columns.date")} : {formatDateLong(a.date)}</p>
                  {getStatusBadge(a.agreed)}
                </div>
                <div className="contracts-actions">
                  {a.contract?.pdf && (
                    <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="contracts-btn contracts-btn-secondary contracts-btn-sm">
                      <DownloadIcon /> PDF
                    </a>
                  )}
                  <button className="contracts-btn contracts-btn-primary contracts-btn-sm" onClick={() => handleAccept(a.id)} disabled={acceptingId === a.id}>
                    {acceptingId === a.id ? t("contracts.accepting") : t("contracts.accept")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptedAgreements.length > 0 && (
        <div className="contracts-section">
          <h4 className="contracts-section-title">{t("contracts.acceptedSection", { count: acceptedAgreements.length })}</h4>
          <div className="contracts-table-container">
            <table className="contracts-table">
              <thead>
                <tr>
                  <th>{t("columns.contract")}</th>
                  <th>{t("contracts.acceptDate")}</th>
                  <th>{t("columns.status")}</th>
                  <th>{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {acceptedAgreements.map((a) => (
                  <tr key={a.id}>
                    <td><span className="contracts-name-cell">{a.contract?.name || `${t("contracts.contractNumber")} #${a.contractId}`}</span></td>
                    <td>{formatDateLong(a.date)}</td>
                    <td>{getStatusBadge(a.agreed)}</td>
                    <td className="contracts-actions-cell">
                      {a.contract?.pdf && (
                        <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="contracts-action-btn" title={t("actions.downloadPdf")}>
                          <DownloadIcon />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {agreements.length === 0 && (
        <div className="contracts-empty-state">
          <ContractIcon />
          <h3>{t("contracts.empty.title")}</h3>
          <p>{t("contracts.empty.description")}</p>
        </div>
      )}
    </div>
  );
}
