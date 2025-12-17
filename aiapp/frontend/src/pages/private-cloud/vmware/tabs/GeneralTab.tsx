import { useTranslation } from "react-i18next";

interface DedicatedCloud { serviceName: string; description?: string; location: string; managementInterface: string; version: string; state: string; commercialRange: string; billingType: string; }
interface GeneralTabProps { serviceId: string; service: DedicatedCloud | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, service, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("private-cloud/vmware/index");
  const { t: tCommon } = useTranslation("common");
  if (!service) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.serviceName")}</div><div className="card-value mono">{service.serviceName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.location")}</div><div className="card-value">{service.location}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.version")}</div><div className="card-value">{service.version}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.range")}</div><div className="card-value">{service.commercialRange}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.billing")}</div><div className="card-value">{service.billingType}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.access.title")}</h3>
        <p style={{ marginTop: "var(--space-2)", marginBottom: "var(--space-3)" }}>{t("general.access.description")}</p>
        <a href={`https://${service.managementInterface}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t("general.access.vSphere")}</a>
      </div>
    </div>
  );
}
