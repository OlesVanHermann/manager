// ============================================================
// HOSTING TAB: LOGS - Logs et statistiques
// ============================================================

import { useTranslation } from "react-i18next";
import { Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { serviceName: string; details?: Hosting; }

/** Onglet Logs et statistiques. */
export function LogsTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");

  const logsUrl = details ? `https://logs.cluster0${details.cluster}.hosting.ovh.net/${serviceName}/` : null;
  const statsUrl = details ? `https://logs.cluster0${details.cluster}.hosting.ovh.net/${serviceName}/statistics/` : null;

  return (
    <div className="logs-tab">
      <div className="tab-header">
        <h3>{t("logs.title")}</h3>
        <p className="tab-description">{t("logs.description")}</p>
      </div>

      <div className="logs-cards">
        <a href={logsUrl || '#'} target="_blank" rel="noopener noreferrer" className="logs-card">
          <div className="logs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </div>
          <h4>{t("logs.rawLogs")}</h4>
          <p>{t("logs.rawLogsDesc")}</p>
        </a>

        <a href={statsUrl || '#'} target="_blank" rel="noopener noreferrer" className="logs-card">
          <div className="logs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
          </div>
          <h4>{t("logs.statistics")}</h4>
          <p>{t("logs.statisticsDesc")}</p>
        </a>
      </div>

      <div className="info-box">
        <h4>{t("logs.access")}</h4>
        <p>{t("logs.accessInfo")}</p>
      </div>
    </div>
  );
}

export default LogsTab;
