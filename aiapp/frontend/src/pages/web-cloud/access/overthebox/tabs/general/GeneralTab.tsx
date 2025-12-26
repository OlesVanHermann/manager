import { useTranslation } from "react-i18next";
import type { OverTheBox } from "../../overthebox.types";
import "./GeneralTab.css";

interface Props {
  serviceName: string;
  details: OverTheBox | null;
}

export function GeneralTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/access/overthebox/general");

  return (
    <div className="general-otb-container">
      <div className="general-otb-header">
        <div>
          <h3>{t("title")}</h3>
        </div>
      </div>
      <div className={`general-otb-device-card ${details?.status === 'active' ? 'online' : 'offline'}`}>
        <div className="general-otb-device-status">
          <div className="general-otb-device-icon">
            {details?.status === 'active' ? '📡' : '📴'}
          </div>
          <div className="general-otb-device-info">
            <h3>{details?.customerDescription || serviceName}</h3>
            <p>{t("serviceName")}: {serviceName}</p>
            <div className="general-otb-device-meta">
              <span className={`badge ${details?.status === 'active' ? 'success' : 'error'}`}>
                {details?.status || 'unknown'}
              </span>
              {details?.systemVersion && (
                <span className="badge info">v{details.systemVersion}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <section className="general-otb-info-section">
        <div className="general-otb-info-grid">
          <div className="general-otb-info-item">
            <label>{t("releaseChannel")}</label>
            <span className="badge">{details?.releaseChannel || '-'}</span>
          </div>
          <div className="general-otb-info-item">
            <label>{t("tunnelMode")}</label>
            <span>{details?.tunnelMode || '-'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GeneralTab;
