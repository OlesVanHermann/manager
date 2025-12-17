import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as aiService from "../../../../services/public-cloud.ai";

interface Job { id: string; name?: string; image: string; status: string; createdAt: string; finishedAt?: string; }
interface JobsTabProps { projectId: string; }

export default function JobsTab({ projectId }: JobsTabProps) {
  const { t } = useTranslation("public-cloud/ai/index");
  const { t: tCommon } = useTranslation("common");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadJobs(); }, [projectId]);

  const loadJobs = async () => {
    try { setLoading(true); setError(null); const data = await aiService.getJobs(projectId); setJobs(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { DONE: "badge-success", RUNNING: "badge-info", PENDING: "badge-warning", FAILED: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadJobs}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="jobs-tab">
      <div className="tab-toolbar"><h2>{t("jobs.title")}</h2><button className="btn btn-primary">{t("jobs.create")}</button></div>
      {jobs.length === 0 ? (
        <div className="empty-state"><h2>{t("jobs.empty.title")}</h2><p>{t("jobs.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("jobs.columns.name")}</th><th>{t("jobs.columns.image")}</th><th>{t("jobs.columns.status")}</th><th>{t("jobs.columns.created")}</th><th>{t("jobs.columns.actions")}</th></tr></thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}><td>{job.name || job.id}</td><td className="mono" style={{ fontSize: "var(--font-size-sm)" }}>{job.image}</td><td>{getStatusBadge(job.status)}</td><td>{new Date(job.createdAt).toLocaleDateString("fr-FR")}</td><td className="item-actions"><button className="btn btn-sm btn-outline">{t("jobs.actions.logs")}</button>{job.status === "RUNNING" && <button className="btn btn-sm btn-outline btn-danger">{t("jobs.actions.stop")}</button>}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
