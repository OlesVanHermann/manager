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
  const [counts, setCounts] = useState({ vps: 0, dedicated: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [vpsList, dedicatedList] = await Promise.all([
          vpsService.listVps().catch(() => []),
          dedicatedService.listServers().catch(() => []),
        ]);
        setCounts({ vps: vpsList.length, dedicated: dedicatedList.length });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="bare-metal-dashboard">
      <header className="dashboard-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>
      <div className="dashboard-tiles">
        <Link to="/bare-metal/vps" className="dashboard-tile">
          <div className="tile-icon vps"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.vps")}</h3>
            <span className="tile-count">{loading ? '...' : counts.vps}</span>
            <p>{t("tiles.vpsDesc")}</p>
          </div>
        </Link>
        <Link to="/bare-metal/dedicated" className="dashboard-tile">
          <div className="tile-icon dedicated"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.dedicated")}</h3>
            <span className="tile-count">{loading ? '...' : counts.dedicated}</span>
            <p>{t("tiles.dedicatedDesc")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
