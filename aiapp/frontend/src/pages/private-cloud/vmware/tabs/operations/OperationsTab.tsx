import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { operationsService, getOperationStateBadgeClass } from "./OperationsTab.service";
import type { Operation } from "../../vmware.types";
import "./OperationsTab.css";
export default function OperationsTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { loadData(); }, [serviceId]);
  const loadData = async () => { try { setLoading(true); setError(null); setOperations(await operationsService.getOperations(serviceId)); } catch (e) { setError(e instanceof Error ? e.message : "Erreur"); } finally { setLoading(false); } };
  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!operations.length) return <div className="operations-empty"><h2>{t("operations.empty.title")}</h2></div>;
  return (
    <div className="operations-tab">
      <div className="operations-toolbar"><h2>{t("operations.title")}</h2><button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button></div>
      <table className="operations-table"><thead><tr><th>{t("operations.columns.name")}</th><th>{t("operations.columns.state")}</th><th>{t("operations.columns.progress")}</th><th>{t("operations.columns.started")}</th><th>{t("operations.columns.ended")}</th></tr></thead>
        <tbody>{operations.map((op) => <tr key={op.operationId}><td>{op.name}</td><td><span className={`status-badge ${getOperationStateBadgeClass(op.state)}`}>{op.state}</span></td><td>{op.progress}%</td><td>{new Date(op.startedOn).toLocaleString("fr-FR")}</td><td>{op.endedOn ? new Date(op.endedOn).toLocaleString("fr-FR") : "-"}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
