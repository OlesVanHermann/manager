import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as carrierSipService from "../../../../services/web-cloud.carrier-sip";

interface CdrRecord { id: string; caller: string; callee: string; startDate: string; duration: number; status: string; }
interface CdrTabProps { serviceId: string; }

export default function CdrTab({ serviceId }: CdrTabProps) {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const { t: tCommon } = useTranslation("common");
  const [records, setRecords] = useState<CdrRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadRecords(); }, [serviceId]);

  const loadRecords = async () => {
    try { setLoading(true); setError(null); const data = await carrierSipService.getCdrRecords(serviceId); setRecords(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { answered: "badge-success", failed: "badge-error", busy: "badge-warning", noanswer: "badge-secondary" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`cdr.status.${status}`)}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadRecords}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="cdr-tab">
      <div className="tab-toolbar"><h2>{t("cdr.title")}</h2><button className="btn btn-outline" onClick={loadRecords}>{tCommon("actions.refresh")}</button></div>
      {records.length === 0 ? <div className="empty-state"><h2>{t("cdr.empty.title")}</h2></div> : (
        <table className="data-table">
          <thead><tr><th>{t("cdr.columns.date")}</th><th>{t("cdr.columns.caller")}</th><th>{t("cdr.columns.callee")}</th><th>{t("cdr.columns.duration")}</th><th>{t("cdr.columns.status")}</th></tr></thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.startDate).toLocaleString("fr-FR")}</td>
                <td className="mono">{record.caller}</td>
                <td className="mono">{record.callee}</td>
                <td>{formatDuration(record.duration)}</td>
                <td>{getStatusBadge(record.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
