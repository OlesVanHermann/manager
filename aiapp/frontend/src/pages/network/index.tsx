// ============================================================
// NETWORK - Dashboard
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { networkService } from "../../services/network";
import "./styles.css";

export default function NetworkDashboard() {
  const { t } = useTranslation("network/index");
  const [counts, setCounts] = useState({ ips: 0, vracks: 0, lbs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ips, vracks, lbs] = await Promise.all([
          networkService.listIps().catch(() => []),
          networkService.listVracks().catch(() => []),
          networkService.listLoadBalancers().catch(() => []),
        ]);
        setCounts({ ips: ips.length, vracks: vracks.length, lbs: lbs.length });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="network-dashboard">
      <header className="dashboard-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>
      <div className="dashboard-tiles">
        <Link to="/network/ip" className="dashboard-tile">
          <div className="tile-icon ip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.ip")}</h3>
            <span className="tile-count">{loading ? '...' : counts.ips}</span>
            <p>{t("tiles.ipDesc")}</p>
          </div>
        </Link>
        <Link to="/network/vrack" className="dashboard-tile">
          <div className="tile-icon vrack"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.vrack")}</h3>
            <span className="tile-count">{loading ? '...' : counts.vracks}</span>
            <p>{t("tiles.vrackDesc")}</p>
          </div>
        </Link>
        <Link to="/network/load-balancer" className="dashboard-tile">
          <div className="tile-icon lb"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.lb")}</h3>
            <span className="tile-count">{loading ? '...' : counts.lbs}</span>
            <p>{t("tiles.lbDesc")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
