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
  const [counts, setCounts] = useState({ ips: 0, vracks: 0, lbs: 0, cdn: 0, cloudConnect: 0, vrackServices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ips, vracks, lbs] = await Promise.all([
          networkService.listIps().catch(() => []),
          networkService.listVracks().catch(() => []),
          networkService.listLoadBalancers().catch(() => []),
        ]);
        setCounts({ ips: ips.length, vracks: vracks.length, lbs: lbs.length, cdn: 0, cloudConnect: 0, vrackServices: 0 });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const services = [
    { key: "ip", path: "/network/ip", icon: "🌐", count: counts.ips },
    { key: "vrack", path: "/network/vrack", icon: "🔗", count: counts.vracks },
    { key: "lb", path: "/network/load-balancer", icon: "⚖️", count: counts.lbs },
    { key: "cdn", path: "/network/cdn", icon: "🚀", count: counts.cdn },
    { key: "cloudConnect", path: "/network/cloud-connect", icon: "🔌", count: counts.cloudConnect },
    { key: "vrackServices", path: "/network/vrack-services", icon: "🌐", count: counts.vrackServices },
    { key: "security", path: "/network/security", icon: "🛡️", count: 0 },
  ];

  return (
    <div className="network-dashboard">
      <header className="dashboard-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>
      <div className="dashboard-tiles">
        {services.map((svc) => (
          <Link key={svc.key} to={svc.path} className="dashboard-tile">
            <div className="tile-icon">{svc.icon}</div>
            <div className="tile-content">
              <h3>{t(`tiles.${svc.key}`)}</h3>
              <span className="tile-count">{loading ? '...' : svc.count}</span>
              <p>{t(`tiles.${svc.key}Desc`)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
