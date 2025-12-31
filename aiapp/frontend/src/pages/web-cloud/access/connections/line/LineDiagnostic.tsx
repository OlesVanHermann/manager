// ============================================================
// LINE DIAGNOSTIC - NAV4 Diagnostic
// 6 Status Cards + Détails ligne + Assistant résolution
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LineDiagnostic as LineDiagnosticType } from "../connections.types";

interface LineDiagnosticProps {
  connectionId: string;
  diagnostic: LineDiagnosticType | null;
  loading: boolean;
  onRunDiagnostic: () => void;
  onViewHistory: () => void;
}

type ProblemType = "slow" | "disconnect" | "noconnect" | "intermittent" | "";

export function LineDiagnostic({
  connectionId,
  diagnostic,
  loading,
  onRunDiagnostic,
  onViewHistory,
}: LineDiagnosticProps) {
  const { t } = useTranslation("web-cloud/access/connections");
  const [selectedProblem, setSelectedProblem] = useState<ProblemType>("");

  const getStatusCardClass = (status: string): string => {
    switch (status) {
      case "ok": return "status-card-ok";
      case "warning": return "status-card-warning";
      case "error": return "status-card-error";
      default: return "status-card-pending";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case "ok": return "✓";
      case "warning": return "⚠";
      case "error": return "✗";
      default: return "?";
    }
  };

  // Construire les 6 status cards à partir du diagnostic
  const statusCards = diagnostic ? [
    {
      id: "ovh_incident",
      title: t("line.diagnostic.cards.ovhIncident"),
      status: diagnostic.tests?.find(t => t.test === "ovh_incident")?.status || "ok",
      message: diagnostic.tests?.find(t => t.test === "ovh_incident")?.message || t("line.diagnostic.noIncident"),
    },
    {
      id: "connection",
      title: t("line.diagnostic.cards.connection"),
      status: diagnostic.tests?.find(t => t.test === "connection")?.status || "ok",
      message: diagnostic.tests?.find(t => t.test === "connection")?.message || t("line.diagnostic.equipmentConnected"),
    },
    {
      id: "lns",
      title: t("line.diagnostic.cards.lns"),
      status: diagnostic.tests?.find(t => t.test === "lns")?.status || "ok",
      message: diagnostic.tests?.find(t => t.test === "lns")?.message || t("line.diagnostic.lnsActive"),
    },
    {
      id: "ping",
      title: t("line.diagnostic.cards.ping"),
      status: diagnostic.tests?.find(t => t.test === "ping")?.status || "ok",
      message: diagnostic.latency ? `${diagnostic.latency}ms` : "-",
    },
    {
      id: "sync",
      title: t("line.diagnostic.cards.sync"),
      status: diagnostic.tests?.find(t => t.test === "sync")?.status || "ok",
      message: diagnostic.tests?.find(t => t.test === "sync")?.message || t("line.diagnostic.syncOk"),
    },
    {
      id: "quality",
      title: t("line.diagnostic.cards.quality"),
      status: diagnostic.tests?.find(t => t.test === "quality")?.status || "ok",
      message: diagnostic.tests?.find(t => t.test === "quality")?.message || t("line.diagnostic.qualityOk"),
    },
  ] : [];

  const problemOptions: { id: ProblemType; label: string }[] = [
    { id: "slow", label: t("line.diagnostic.problems.slow") },
    { id: "disconnect", label: t("line.diagnostic.problems.disconnect") },
    { id: "noconnect", label: t("line.diagnostic.problems.noconnect") },
    { id: "intermittent", label: t("line.diagnostic.problems.intermittent") },
  ];

  return (
    <div className="line-diagnostic">
      {/* Header */}
      <div className="diagnostic-header">
        <div className="diagnostic-header-info">
          <h4>{t("line.diagnostic.title")}</h4>
          {diagnostic?.date && (
            <span className="diagnostic-date">
              {t("line.diagnostic.lastRun")}: {diagnostic.date}
            </span>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={onRunDiagnostic}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-small" />
              {t("line.diagnostic.running")}
            </>
          ) : (
            <>▶ {t("line.diagnostic.run")}</>
          )}
        </button>
      </div>

      {/* 6 Status Cards */}
      {diagnostic && (
        <div className="diagnostic-cards-grid">
          {statusCards.map((card) => (
            <div
              key={card.id}
              className={`diagnostic-status-card ${getStatusCardClass(card.status)}`}
            >
              <div className="card-status-icon">
                {getStatusIcon(card.status)}
              </div>
              <div className="card-content">
                <span className="card-title">{card.title}</span>
                <span className="card-message">{card.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Détails Ligne */}
      {diagnostic && (
        <div className="diagnostic-details-card">
          <h4>{t("line.diagnostic.detailsTitle")}</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">{t("line.diagnostic.profile")}</span>
              <span className="detail-value">{diagnostic.lineProfile || "-"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("line.diagnostic.downSpeed")}</span>
              <span className="detail-value">{diagnostic.downSpeed ? `${diagnostic.downSpeed} Mbps` : "-"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("line.diagnostic.upSpeed")}</span>
              <span className="detail-value">{diagnostic.upSpeed ? `${diagnostic.upSpeed} Mbps` : "-"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("line.diagnostic.latency")}</span>
              <span className="detail-value">{diagnostic.latency ? `${diagnostic.latency}ms` : "-"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t("line.diagnostic.packetLoss")}</span>
              <span className="detail-value">{diagnostic.packetLoss !== undefined ? `${diagnostic.packetLoss}%` : "-"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Résolution */}
      <div className="diagnostic-assistant-card">
        <h4>{t("line.diagnostic.assistantTitle")}</h4>
        <p className="assistant-description">{t("line.diagnostic.assistantDescription")}</p>
        <div className="problem-options">
          {problemOptions.map((option) => (
            <label key={option.id} className="problem-option">
              <input
                type="radio"
                name="problem"
                value={option.id}
                checked={selectedProblem === option.id}
                onChange={() => setSelectedProblem(option.id)}
              />
              <span className="radio-label">{option.label}</span>
            </label>
          ))}
        </div>
        <button
          className="btn-primary"
          disabled={!selectedProblem}
        >
          {t("line.diagnostic.launchAssistant")} →
        </button>
      </div>

      {/* Lien Historique */}
      <div className="diagnostic-footer">
        <button className="btn-link" onClick={onViewHistory}>
          📜 {t("line.diagnostic.viewHistory")}
        </button>
      </div>

      {/* État vide */}
      {!diagnostic && !loading && (
        <div className="diagnostic-empty">
          <span className="empty-icon">🔍</span>
          <p>{t("line.diagnostic.empty")}</p>
          <button className="btn-primary" onClick={onRunDiagnostic}>
            ▶ {t("line.diagnostic.runFirst")}
          </button>
        </div>
      )}
    </div>
  );
}

export default LineDiagnostic;
