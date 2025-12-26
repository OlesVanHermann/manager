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
      case "ok": return <span className="billing-contracts-badge contracts-badge-success">{t("contracts.status.accepted")}</span>;
      case "todo": return <span className="billing-contracts-badge contracts-badge-warning">{t("contracts.status.toSign")}</span>;
      case "ko": return <span className="billing-contracts-badge contracts-badge-error">{t("contracts.status.refused")}</span>;
      default: return <span className="billing-contracts-badge">{agreed}</span>;
    }
  };

  if (loading) {
    return (
      <div className="billing-contracts-panel">
        <div className="billing-contracts-loading-state">
          <div className="billing-contracts-spinner"></div>
          <p>{t("contracts.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="billing-contracts-panel">
        <div className="billing-contracts-error-banner">
          {error}
          <button onClick={loadAgreements} className="billing-contracts-btn contracts-btn-secondary contracts-btn-sm" style={{ marginLeft: "1rem" }}>
            {tCommon("actions.refresh")}
          </button>
        </div>
      </div>
    );
  }

  const pendingAgreements = agreements.filter(a => a.agreed === "todo");
  const acceptedAgreements = agreements.filter(a => a.agreed === "ok");

  return (
    <div className="billing-contracts-panel">
      <div className="billing-contracts-toolbar">
        <span className="billing-contracts-result-count">{t("contracts.count", { count: agreements.length })}</span>
      </div>

      {pendingAgreements.length > 0 && (
        <div className="billing-contracts-section">
          <h4 className="billing-contracts-section-title">
            <span className="billing-contracts-warning-icon">⚠</span>
            {t("contracts.pendingSection", { count: pendingAgreements.length })}
          </h4>
          <div className="billing-contracts-list">
            {pendingAgreements.map((a) => (
              <div key={a.id} className="billing-contracts-card contracts-pending">
                <div className="billing-contracts-info">
                  <h5 className="billing-contracts-name">{a.contract?.name || `${t("contracts.contractNumber")} #${a.contractId}`}</h5>
                  <p className="billing-contracts-date">{t("columns.date")} : {formatDateLong(a.date)}</p>
                  {getStatusBadge(a.agreed)}
                </div>
                <div className="billing-contracts-actions">
                  {a.contract?.pdf && (
                    <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="billing-contracts-btn contracts-btn-secondary contracts-btn-sm">
                      <DownloadIcon /> PDF
                    </a>
                  )}
                  <button className="billing-contracts-btn contracts-btn-primary contracts-btn-sm" onClick={() => handleAccept(a.id)} disabled={acceptingId === a.id}>
                    {acceptingId === a.id ? t("contracts.accepting") : t("contracts.accept")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptedAgreements.length > 0 && (
        <div className="billing-contracts-section">
          <h4 className="billing-contracts-section-title">{t("contracts.acceptedSection", { count: acceptedAgreements.length })}</h4>
          <div className="billing-contracts-table-container">
            <table className="billing-contracts-table">
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
                    <td><span className="billing-contracts-name-cell">{a.contract?.name || `${t("contracts.contractNumber")} #${a.contractId}`}</span></td>
                    <td>{formatDateLong(a.date)}</td>
                    <td>{getStatusBadge(a.agreed)}</td>
                    <td className="billing-contracts-actions-cell">
                      {a.contract?.pdf && (
                        <a href={a.contract.pdf} target="_blank" rel="noopener noreferrer" className="billing-contracts-action-btn" title={t("actions.downloadPdf")}>
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
        <div className="billing-contracts-empty-state">
          <ContractIcon />
          <h3>{t("contracts.empty.title")}</h3>
          <p>{t("contracts.empty.description")}</p>
        </div>
      )}
    </div>
  );
}
