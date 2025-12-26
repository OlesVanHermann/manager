// ############################################################
// #  BARE-METAL/DASHBOARD - COMPOSANT PAGE ISOLÉ             #
// #  CSS LOCAL : ./index.css                                 #
// #  I18N LOCAL : bare-metal/index                           #
// #  SERVICE LOCAL : ./index.service.ts                      #
// #  CLASSES CSS : .bare-metal-dashboard-*                   #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { dashboardService } from "./index.service";

import "./index.css";

// ============================================================
// COMPOSANT DASHBOARD
// ============================================================

export default function BareMetalDashboard() {
  const { t } = useTranslation("bare-metal/index");
  const [counts, setCounts] = useState({ vps: 0, dedicated: 0, nasha: 0, netapp: 0, housing: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vpsList, dedicatedList, nashaList, netappList, housingList] = await Promise.all([
          dashboardService.listVps().catch(() => []),
          dashboardService.listDedicated().catch(() => []),
          dashboardService.listNasha().catch(() => []),
          dashboardService.listNetapp().catch(() => []),
          dashboardService.listHousing().catch(() => []),
        ]);
        setCounts({
          vps: vpsList.length,
          dedicated: dedicatedList.length,
          nasha: nashaList.length,
          netapp: netappList.length,
          housing: housingList.length,
        });
      } finally {
        setLoading(false);
      }
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
      <header className="bare-metal-dashboard-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>
      <div className="bare-metal-dashboard-tiles">
        {services.map((svc) => (
          <Link key={svc.key} to={svc.path} className="bare-metal-dashboard-tile">
            <div className="bare-metal-dashboard-tile-icon">{svc.icon}</div>
            <div className="bare-metal-dashboard-tile-content">
              <h3>{t(`tiles.${svc.key}`)}</h3>
              <span className="bare-metal-dashboard-tile-count">{loading ? "..." : svc.count}</span>
              <p>{t(`tiles.${svc.key}Desc`)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
