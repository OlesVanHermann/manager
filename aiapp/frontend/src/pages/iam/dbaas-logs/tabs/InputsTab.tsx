// ============================================================
// INPUTS TAB - Gestion des inputs de collecte
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "../../../../services/iam.dbaas-logs";

// ============================================================
// TYPES
// ============================================================

interface Input {
  inputId: string;
  title: string;
  description?: string;
  engineId: string;
  streamId: string;
  exposedPort: string;
  publicAddress: string;
  sslEnabled: boolean;
  status: "RUNNING" | "PENDING" | "DISABLED";
  createdAt: string;
}

interface InputsTabProps {
  serviceId: string;
}

// ============================================================
// COMPOSANT
// ============================================================

/** Gestion des inputs de collecte de logs. */
export default function InputsTab({ serviceId }: InputsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
  const { t: tCommon } = useTranslation("common");

  // ---------- STATE ----------
  const [inputs, setInputs] = useState<Input[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadInputs();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadInputs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getInputs(serviceId);
      setInputs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: Input["status"]) => {
    const classes: Record<string, string> = {
      RUNNING: "badge-success",
      PENDING: "badge-warning",
      DISABLED: "badge-secondary",
    };
    return <span className={`status-badge ${classes[status]}`}>{t(`inputs.status.${status}`)}</span>;
  };

  // ---------- RENDER ----------
  if (loading) {
    return <div className="loading-state">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadInputs}>{tCommon("actions.retry")}</button>
      </div>
    );
  }

  return (
    <div className="inputs-tab">
      <div className="tab-toolbar">
        <h2>{t("inputs.title")}</h2>
        <button className="btn btn-primary">{t("inputs.create")}</button>
      </div>

      {inputs.length === 0 ? (
        <div className="empty-state">
          <h2>{t("inputs.empty.title")}</h2>
          <p>{t("inputs.empty.description")}</p>
        </div>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>{t("inputs.columns.title")}</th>
              <th>{t("inputs.columns.endpoint")}</th>
              <th>{t("inputs.columns.ssl")}</th>
              <th>{t("inputs.columns.status")}</th>
              <th>{t("inputs.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input) => (
              <tr key={input.inputId}>
                <td>
                  <div className="input-title">{input.title}</div>
                  {input.description && <div className="input-desc" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>{input.description}</div>}
                </td>
                <td>
                  <code style={{ fontSize: "var(--font-size-sm)" }}>{input.publicAddress}:{input.exposedPort}</code>
                </td>
                <td>{input.sslEnabled ? "🔒 SSL" : "❌"}</td>
                <td>{getStatusBadge(input.status)}</td>
                <td className="item-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
