import { useTranslation } from "react-i18next";
import type { DedicatedCloud } from "../../vmware.types";
import "./GeneralTab.css";
interface GeneralTabProps { serviceId: string; service: DedicatedCloud | null; onRefresh: () => void; }
export default function GeneralTab({ serviceId, service, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  if (!service) return <div className="loading-state">{tCommon("loading")}</div>;
  return (
    <div className="general-tab">
      <div className="general-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="general-info-grid">
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.serviceName")}</div><div className="general-card-value mono">{service.serviceName}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.location")}</div><div className="general-card-value">{service.location}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.version")}</div><div className="general-card-value">{service.version}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.range")}</div><div className="general-card-value">{service.commercialRange}</div></div>
        <div className="general-info-card"><div className="general-card-title">{t("general.fields.billing")}</div><div className="general-card-value">{service.billingType}</div></div>
      </div>
      <div className="general-access-card"><h3>{t("general.access.title")}</h3><p>{t("general.access.description")}</p><a href={`https://${service.managementInterface}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t("general.access.vSphere")}</a></div>
    </div>
  );
}
