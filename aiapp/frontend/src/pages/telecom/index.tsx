// ============================================================
// TELECOM - Dashboard
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { telecomService } from "../../services/telecom.service";
import "./styles.css";

export default function TelecomDashboard() {
  const { t } = useTranslation("telecom/index");
  const [counts, setCounts] = useState({ voip: 0, sms: 0, fax: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [voip, sms, fax] = await Promise.all([
          telecomService.listBillingAccounts().catch(() => []),
          telecomService.listSmsAccounts().catch(() => []),
          telecomService.listFreefax().catch(() => []),
        ]);
        setCounts({ voip: voip.length, sms: sms.length, fax: fax.length });
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="telecom-dashboard">
      <header className="dashboard-header">
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </header>
      <div className="dashboard-tiles">
        <Link to="/telecom/voip" className="dashboard-tile">
          <div className="tile-icon voip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.voip")}</h3>
            <span className="tile-count">{loading ? '...' : counts.voip}</span>
            <p>{t("tiles.voipDesc")}</p>
          </div>
        </Link>
        <Link to="/telecom/sms" className="dashboard-tile">
          <div className="tile-icon sms"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.sms")}</h3>
            <span className="tile-count">{loading ? '...' : counts.sms}</span>
            <p>{t("tiles.smsDesc")}</p>
          </div>
        </Link>
        <Link to="/telecom/fax" className="dashboard-tile">
          <div className="tile-icon fax"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg></div>
          <div className="tile-content">
            <h3>{t("tiles.fax")}</h3>
            <span className="tile-count">{loading ? '...' : counts.fax}</span>
            <p>{t("tiles.faxDesc")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
