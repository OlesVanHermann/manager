import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { operationsService, getOperationStateBadgeClass } from "./OperationsTab.service";
import type { Operation } from "../../vmware.types";
import "./OperationsTab.css";

export default function OperationsTab({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation("private-cloud/vmware/operations");
  const { t: tCommon } = useTranslation("common");

  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      setOperations(await operationsService.getOperations(serviceId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadData}>{tCommon("actions.retry")}</button></div>;
  if (!operations.length) return <div className="operations-empty"><h2>{t("empty.title")}</h2><p>{t("empty.description")}</p></div>;

  return (
    <div className="operations-tab">
      <div className="operations-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadData}>{tCommon("actions.refresh")}</button>
      </div>
      <table className="operations-table">
        <thead>
          <tr>
            <th>{t("columns.name")}</th>
            <th>{t("columns.state")}</th>
            <th>{t("columns.progress")}</th>
            <th>{t("columns.started")}</th>
            <th>{t("columns.ended")}</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((op) => (
            <tr key={op.operationId}>
              <td><strong>{op.name}</strong></td>
              <td><span className={`status-badge ${getOperationStateBadgeClass(op.state)}`}>{t(`states.${op.state}`)}</span></td>
              <td>
                <div className="operations-progress">
                  <div className="operations-progress-bar">
                    <div className="operations-progress-fill" style={{ width: `${op.progress}%` }}></div>
                  </div>
                  <span>{op.progress}%</span>
                </div>
              </td>
              <td>{formatDate(op.startedAt)}</td>
              <td>{formatDate(op.endedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
