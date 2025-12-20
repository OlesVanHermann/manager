import { useTranslation } from "react-i18next";
import { OverTheBox } from "../../../../../services/web-cloud.overthebox";

interface Props { serviceName: string; details: OverTheBox | null; }

export function GeneralTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/overthebox/index");

  return (
    <div className="general-tab">
      <div className="tab-header"><div><h3>{t("general.title")}</h3></div></div>
      <div className={`device-card ${details?.status === 'active' ? 'online' : 'offline'}`}>
        <div className="device-status">
          <div className="device-icon">{details?.status === 'active' ? '📡' : '📴'}</div>
          <div className="device-info">
            <h3>{details?.customerDescription || serviceName}</h3>
            <p>{t("general.serviceName")}: {serviceName}</p>
            <div className="device-meta">
              <span className={`badge ${details?.status === 'active' ? 'success' : 'error'}`}>{details?.status || 'unknown'}</span>
              {details?.systemVersion && <span className="badge info">v{details.systemVersion}</span>}
            </div>
          </div>
        </div>
      </div>
      <section className="info-section">
        <div className="info-grid">
          <div className="info-item"><label>{t("general.releaseChannel")}</label><span className="badge">{details?.releaseChannel || '-'}</span></div>
          <div className="info-item"><label>{t("general.tunnelMode")}</label><span>{details?.tunnelMode || '-'}</span></div>
        </div>
      </section>
    </div>
  );
}
export default GeneralTab;
