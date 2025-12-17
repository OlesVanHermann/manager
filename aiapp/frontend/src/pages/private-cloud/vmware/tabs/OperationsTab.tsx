import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vmwareService from "../../../../services/private-cloud.vmware";

interface Operation { operationId: number; name: string; state: string; progress: number; startedOn: string; endedOn?: string; }
interface OperationsTabProps { serviceId: string; }

export default function OperationsTab({ serviceId }: OperationsTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadOperations(); }, [serviceId]);

  const loadOperations = async () => {
    try { setLoading(true); setError(null); const data = await vmwareService.getOperations(serviceId); setOperations(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStateBadge = (state: string) => {
    const classes: Record<string, string> = { done: "badge-success", doing: "badge-info", todo: "badge-warning", error: "badge-error", cancelled: "badge-secondary" };
    return <span className={`status-badge ${classes[state] || ""}`}>{state}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadOperations}>{tCommon("actions.retry")}</button></div>;
  if (operations.length === 0) return <div className="empty-state"><h2>{t("operations.empty.title")}</h2></div>;

  return (
    <div className="operations-tab">
      <div className="tab-toolbar"><h2>{t("operations.title")}</h2><button className="btn btn-outline" onClick={loadOperations}>{tCommon("actions.refresh")}</button></div>
      <table className="data-table">
        <thead><tr><th>{t("operations.columns.name")}</th><th>{t("operations.columns.state")}</th><th>{t("operations.columns.progress")}</th><th>{t("operations.columns.started")}</th><th>{t("operations.columns.ended")}</th></tr></thead>
        <tbody>
          {operations.map((op) => (
            <tr key={op.operationId}>
              <td>{op.name}</td>
              <td>{getStateBadge(op.state)}</td>
              <td><div className="usage-bar" style={{ width: "100px" }}><div className="usage-fill" style={{ width: `${op.progress}%` }}></div></div><span className="usage-text">{op.progress}%</span></td>
              <td>{new Date(op.startedOn).toLocaleString("fr-FR")}</td>
              <td>{op.endedOn ? new Date(op.endedOn).toLocaleString("fr-FR") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
