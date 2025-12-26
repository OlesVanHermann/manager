// ============================================================
// INPUTS TAB - Gestion des inputs de collecte
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as inputsService from "./InputsTab.service";
import type { Input } from "../dbaas-logs.types";
import "./InputsTab.css";

interface InputsTabProps { serviceId: string; }

export default function InputsTab({ serviceId }: InputsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/inputs");
  const { t: tCommon } = useTranslation("common");

  const [inputs, setInputs] = useState<Input[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadInputs(); }, [serviceId]);

  const loadInputs = async () => {
    try { setLoading(true); setError(null); const data = await inputsService.getInputs(serviceId); setInputs(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: Input["status"]) => {
    const classes: Record<string, string> = { RUNNING: "badge-success", PENDING: "badge-warning", DISABLED: "badge-secondary" };
    return <span className={`inputs-status-badge ${classes[status]}`}>{t(`inputs.status.${status}`)}</span>;
  };

  if (loading) return <div className="dbaas-logs-inputs-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="dbaas-logs-inputs-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadInputs}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="dbaas-logs-inputs-tab">
      <div className="dbaas-logs-inputs-toolbar"><h2>{t("title")}</h2><button className="btn btn-primary">{t("create")}</button></div>
      {inputs.length === 0 ? (
        <div className="dbaas-logs-inputs-empty-state"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>
      ) : (
        <table className="dbaas-logs-inputs-table">
          <thead><tr><th>{t("columns.title")}</th><th>{t("columns.endpoint")}</th><th>{t("columns.ssl")}</th><th>{t("columns.status")}</th><th>{t("columns.actions")}</th></tr></thead>
          <tbody>
            {inputs.map((inp) => (
              <tr key={inp.inputId}>
                <td><div className="dbaas-logs-inputs-title">{inp.title}</div>{inp.description && <div className="dbaas-logs-inputs-desc">{inp.description}</div>}</td>
                <td><code className="dbaas-logs-inputs-endpoint">{inp.publicAddress}:{inp.exposedPort}</code></td>
                <td>{inp.sslEnabled ? "🔒 SSL" : "❌"}</td>
                <td>{getStatusBadge(inp.status)}</td>
                <td className="dbaas-logs-inputs-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
