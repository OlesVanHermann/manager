// ############################################################
// #  VPS/GENERAL - COMPOSANT STRICTEMENT ISOLÉ               #
// ############################################################
import { useTranslation } from "react-i18next";
import type { Vps, VpsServiceInfos } from "../../vps.types";
import "./GeneralTab.css";

interface Props { serviceName: string; details?: Vps; serviceInfos?: VpsServiceInfos; loading: boolean; }

const isExpiringSoon = (exp: string): boolean => (new Date(exp).getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 30;
const getStateClass = (state: string): string => {
  const map: Record<string, string> = { running: "success", stopped: "error", rebooting: "warning", installing: "warning", maintenance: "warning", rescued: "info" };
  return map[state] || "inactive";
};
const formatDate = (date: string): string => new Date(date).toLocaleDateString();

export function GeneralTab({ serviceName, details, serviceInfos, loading }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");

  if (loading) return <div className="vps-general-tab"><div className="vps-general-loading"><div className="vps-general-skeleton" style={{ width: "60%" }} /><div className="vps-general-skeleton" style={{ width: "40%" }} /></div></div>;

  return (
    <div className="vps-general-tab">
      <section className="vps-general-section">
        <h3>{t("general.title")}</h3>
        <div className="vps-general-info-grid">
          <div className="vps-general-info-item"><label>{t("general.name")}</label><span className="mono">{serviceName}</span></div>
          {details && (<>
            <div className="vps-general-info-item"><label>{t("general.displayName")}</label><span>{details.displayName || serviceName}</span></div>
            <div className="vps-general-info-item"><label>{t("general.state")}</label><span className={`vps-general-badge ${getStateClass(details.state)}`}>{details.state}</span></div>
            <div className="vps-general-info-item"><label>{t("general.model")}</label><span>{details.model?.name} ({details.model?.offer})</span></div>
            <div className="vps-general-info-item"><label>{t("general.zone")}</label><span>{details.zone}</span></div>
          </>)}
        </div>
      </section>
      {serviceInfos && (
        <section className="vps-general-section">
          <h3>{t("general.service")}</h3>
          <div className="vps-general-info-grid">
            <div className="vps-general-info-item"><label>{t("general.creation")}</label><span>{formatDate(serviceInfos.creation)}</span></div>
            <div className="vps-general-info-item"><label>{t("general.expiration")}</label><span className={isExpiringSoon(serviceInfos.expiration) ? "vps-general-expiring" : ""}>{formatDate(serviceInfos.expiration)}</span></div>
            <div className="vps-general-info-item"><label>{t("general.renew")}</label><span className={`vps-general-badge ${serviceInfos.renew?.automatic ? "success" : "warning"}`}>{serviceInfos.renew?.automatic ? t("general.automatic") : t("general.manual")}</span></div>
          </div>
        </section>
      )}
    </div>
  );
}
export default GeneralTab;
