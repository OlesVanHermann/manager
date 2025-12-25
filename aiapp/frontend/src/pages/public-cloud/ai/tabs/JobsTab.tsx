// ============================================================
// PUBLIC-CLOUD / AI / JOBS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getJobs, formatDate, getJobStatusClass } from "./JobsTab.service";
import type { Job } from "../ai.types";
import "./JobsTab.css";

interface JobsTabProps {
  projectId: string;
}

export default function JobsTab({ projectId }: JobsTabProps) {
  const { t } = useTranslation("public-cloud/ai/index");
  const { t: tCommon } = useTranslation("common");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [projectId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs(projectId);
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="jobs-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="jobs-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadJobs}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="jobs-tab">
      <div className="jobs-toolbar">
        <h2>{t("jobs.title")}</h2>
        <button className="btn btn-primary">{t("jobs.create")}</button>
      </div>

      {jobs.length === 0 ? (
        <div className="jobs-empty">
          <h2>{t("jobs.empty.title")}</h2>
          <p>{t("jobs.empty.description")}</p>
        </div>
      ) : (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>{t("jobs.columns.name")}</th>
              <th>{t("jobs.columns.image")}</th>
              <th>{t("jobs.columns.status")}</th>
              <th>{t("jobs.columns.created")}</th>
              <th>{t("jobs.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.name || job.id}</td>
                <td className="jobs-image-cell">{job.image}</td>
                <td>
                  <span className={`jobs-status-badge ${getJobStatusClass(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td>{formatDate(job.createdAt)}</td>
                <td className="jobs-actions">
                  <button className="btn btn-sm btn-outline">
                    {t("jobs.actions.logs")}
                  </button>
                  {job.status === "RUNNING" && (
                    <button className="btn btn-sm btn-outline btn-danger">
                      {t("jobs.actions.stop")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
