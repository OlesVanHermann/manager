// ============================================================
// INPUTS TAB - Gestion des inputs de collecte
// ============================================================
// ⚠️ DÉFACTORISÉ : Imports locaux uniquement
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as inputsService from "./InputsTab";
import type { Input } from "../dbaas-logs.types";
import "./InputsTab.css";

interface InputsTabProps { serviceId: string; }

export default function InputsTab({ serviceId }: InputsTabProps) {
  const { t } = useTranslation("iam/dbaas-logs/index");
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

  if (loading) return <div className="inputs-loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="inputs-error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadInputs}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="inputs-tab">
      <div className="inputs-toolbar"><h2>{t("inputs.title")}</h2><button className="btn btn-primary">{t("inputs.create")}</button></div>
      {inputs.length === 0 ? (
        <div className="inputs-empty-state"><h2>{t("inputs.empty.title")}</h2><p>{t("inputs.empty.description")}</p></div>
      ) : (
        <table className="inputs-table">
          <thead><tr><th>{t("inputs.columns.title")}</th><th>{t("inputs.columns.endpoint")}</th><th>{t("inputs.columns.ssl")}</th><th>{t("inputs.columns.status")}</th><th>{t("inputs.columns.actions")}</th></tr></thead>
          <tbody>
            {inputs.map((inp) => (
              <tr key={inp.inputId}>
                <td><div className="inputs-title">{inp.title}</div>{inp.description && <div className="inputs-desc">{inp.description}</div>}</td>
                <td><code className="inputs-endpoint">{inp.publicAddress}:{inp.exposedPort}</code></td>
                <td>{inp.sslEnabled ? "🔒 SSL" : "❌"}</td>
                <td>{getStatusBadge(inp.status)}</td>
                <td className="inputs-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
