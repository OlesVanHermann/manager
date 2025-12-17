// ============================================================
// BARE METAL CLOUD - Dashboard
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { vpsService } from "../../services/bare-metal.vps";
import { dedicatedService } from "../../services/bare-metal.dedicated";
import "./styles.css";

export default function BareMetalDashboard() {
  const { t } = useTranslation("bare-metal/index");
  const [counts, setCounts] = useState({ vps: 0, dedicated: 0, nasha: 0, netapp: 0, housing: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vpsList, dedicatedList] = await Promise.all([
          vpsService.listVps().catch(() => []),
          dedicatedService.listServers().catch(() => []),
        ]);
        setCounts({ vps: vpsList.length, dedicated: dedicatedList.length, nasha: 0, netapp: 0, housing: 0 });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const services = [
    { key: "dedicated", path: "/bare-metal/dedicated", icon: "🖥️", count: counts.dedicated },
    { key: "vps", path: "/bare-metal/vps", icon: "💻", count: counts.vps },
    { key: "nasha", path: "/bare-metal/nasha", icon: "💾", count: counts.nasha },
    { key: "netapp", path: "/bare-metal/netapp", icon: "🗄️", count: counts.netapp },
    { key: "housing", path: "/bare-metal/housing", icon: "🏢", count: counts.housing },
  ];

  return (
    <div className="bare-metal-dashboard">
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
