import { useTranslation } from "react-i18next";

interface VrackServicesInfo { id: string; displayName?: string; productStatus: string; region: string; createdAt: string; }
interface GeneralTabProps { serviceId: string; service: VrackServicesInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, service, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("network/vrack-services/index");
  const { t: tCommon } = useTranslation("common");
  if (!service) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.id")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{service.id}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.name")}</div><div className="card-value">{service.displayName || "-"}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.region")}</div><div className="card-value">{service.region}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.created")}</div><div className="card-value">{new Date(service.createdAt).toLocaleDateString("fr-FR")}</div></div>
      </div>
    </div>
  );
}
