import { useTranslation } from "react-i18next";
import { CarrierSip } from "../../../../../services/web-cloud.carrier-sip";

interface Props { billingAccount: string; serviceName: string; details: CarrierSip | null; }

export function GeneralTab({ billingAccount, serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const percent = details ? Math.round((details.currentCalls / details.maxCalls) * 100) : 0;

  return (
    <div className="general-tab">
      <div className="tab-header"><div><h3>{t("general.title")}</h3></div></div>
      <div className={`trunk-card ${details?.status === 'enabled' ? 'active' : ''}`}>
        <div className="trunk-status">
          <div className="trunk-icon">📡</div>
          <div className="trunk-info">
            <h3>{serviceName}</h3>
            <p>{details?.description || t("general.noDescription")}</p>
            <div className="calls-indicator">
              <div className="calls-bar"><div className="calls-fill" style={{ width: `${percent}%` }} /></div>
              <span className="calls-text">{details?.currentCalls || 0} / {details?.maxCalls || 0} appels</span>
            </div>
          </div>
        </div>
      </div>
      <section className="info-section">
        <div className="info-grid">
          <div className="info-item"><label>{t("general.billingAccount")}</label><span className="font-mono">{billingAccount}</span></div>
          <div className="info-item"><label>{t("general.status")}</label><span className={`badge ${details?.status === 'enabled' ? 'success' : 'warning'}`}>{details?.status || '-'}</span></div>
        </div>
      </section>
    </div>
  );
}
export default GeneralTab;
