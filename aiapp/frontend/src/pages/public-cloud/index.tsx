// ============================================================
// PUBLIC CLOUD - Dashboard
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as projectService from "../../services/public-cloud.project";
import "./styles.css";

export default function PublicCloudDashboard() {
  const { t } = useTranslation("public-cloud/index");
  const [stats, setStats] = useState({ projects: 0, instances: 0, volumes: 0, containers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const projectIds = await projectService.listProjects().catch(() => []);
        let instances = 0, volumes = 0, containers = 0;
        for (const projectId of projectIds.slice(0, 5)) {
          const [inst, vol, cont] = await Promise.all([
            projectService.listInstances(projectId).catch(() => []),
            projectService.listVolumes(projectId).catch(() => []),
            projectService.listContainers(projectId).catch(() => []),
          ]);
          instances += inst.length;
          volumes += vol.length;
          containers += cont.length;
        }
        setStats({ projects: projectIds.length, instances, volumes, containers });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="cloud-dashboard">
      <header className="dashboard-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon projects"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg></div><div className="stat-content"><span className="stat-value">{loading ? '...' : stats.projects}</span><span className="stat-label">{t("stats.projects")}</span></div></div>
        <div className="stat-card"><div className="stat-icon instances"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg></div><div className="stat-content"><span className="stat-value">{loading ? '...' : stats.instances}</span><span className="stat-label">{t("stats.instances")}</span></div></div>
        <div className="stat-card"><div className="stat-icon volumes"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg></div><div className="stat-content"><span className="stat-value">{loading ? '...' : stats.volumes}</span><span className="stat-label">{t("stats.volumes")}</span></div></div>
        <div className="stat-card"><div className="stat-icon storage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></div><div className="stat-content"><span className="stat-value">{loading ? '...' : stats.containers}</span><span className="stat-label">{t("stats.containers")}</span></div></div>
      </div>
      <div className="dashboard-tiles">
        <Link to="/public-cloud/project" className="dashboard-tile">
          <div className="tile-icon compute"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg></div>
          <div className="tile-content"><h3>{t("tiles.compute")}</h3><p>{t("tiles.computeDesc")}</p></div>
        </Link>
        <Link to="/public-cloud/project" className="dashboard-tile">
          <div className="tile-icon storage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></div>
          <div className="tile-content"><h3>{t("tiles.storage")}</h3><p>{t("tiles.storageDesc")}</p></div>
        </Link>
        <Link to="/public-cloud/project" className="dashboard-tile">
          <div className="tile-icon network"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg></div>
          <div className="tile-content"><h3>{t("tiles.network")}</h3><p>{t("tiles.networkDesc")}</p></div>
        </Link>
      </div>
    </div>
  );
}
